<script>
	import * as Table from '$lib/components/ui/table/index.js';
	import { Button } from '$lib/components/ui/button';
	import {
		Dialog,
		DialogTrigger,
		DialogContent,
		DialogHeader,
		DialogTitle
	} from '$lib/components/ui/dialog';
	import {
		ChevronUp,
		ChevronDown,
		ChevronsUpDown,
		Sheet,
		FileUp,
		Upload,
		CloudUpload,
		Download,
		Rows
	} from 'lucide-svelte';
	import {
		PROPUESTA_INDIVIDUAL_URL,
		PROPUESTAS_GLOBAL_URL,
		selectedSidebarItem,
		SIDEBAR_ITEMS
	} from '@/store';
	import { toast } from 'svelte-sonner';

	export let data = [];
	export let columns = {};
	export let perPage = 20;
	export let docKind;

	let currentPage = 1;
	let searchQuery = '';
	let sortColumn = null;
	let sortOrder = 'asc';
	let open = false;
	let csvFile = null;

	$: indexedData = data.map((row, index) => ({ ...row, __originalIndex: index }));

	$: filteredData = indexedData.filter((row) =>
		Object.values(row).some((value) =>
			String(value ?? '')
				.toLowerCase()
				.includes(searchQuery.toLowerCase())
		)
	);

	$: totalPages = Math.max(1, Math.ceil(filteredData.length / perPage));

	$: visibleData = filteredData
		.sort((a, b) => {
			if (!sortColumn) return 0;
			const valA = String(a[sortColumn] ?? '').toLowerCase();
			const valB = String(b[sortColumn] ?? '').toLowerCase();
			return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
		})
		.slice((currentPage - 1) * perPage, perPage * currentPage);

	function setSortColumn(column) {
		if (sortColumn === column) {
			sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
		} else {
			sortColumn = column;
			sortOrder = 'asc';
		}
	}

	function handlePageChange(page) {
		if (page >= 1 && page <= totalPages) {
			currentPage = page;
		}
	}

	function downloadCsvData() {
		const headers = [
			'Index',
			...Object.values(columns).map((col) => JSON.stringify(col.field))
		].join(',');

		const rows = data.map((row, idx) =>
			[idx + 1, ...Object.values(columns).map((col) => JSON.stringify(row[col.field] ?? ''))].join(
				','
			)
		);

		const csvContent = [headers, ...rows].join('\n');
		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.setAttribute('href', url);
		link.setAttribute('download', 'tabla.csv');
		link.style.display = 'none';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}

	function downloadProposalPDF(row) {
		const url = `${PROPUESTA_INDIVIDUAL_URL}?worker=${encodeURIComponent(row.numTrabajador)}`;
		window.open(url, '_blank', 'noopener,noreferrer');
	}

function pickCSV() {
  // Abrir explorador de archivos
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.csv';
  input.onchange = async (e) => {
    const file = e.target.files?.[0];
    if (file) await openAllProposalsFromCSV(file);
  };
  input.click();
}

async function openAllProposalsFromCSV(file) {
  try {
    // 1) leer CSV como texto
    const csvText = await file.text();

    // 2) POST como JSON { csv: "..." } a la API que genera el PDF multi-página
    const res = await fetch(PROPUESTAS_GLOBAL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ csv: csvText })
    });

    if (!res.ok) {
      const msg = await safeText(res);
      throw new Error(`API respondió ${res.status}: ${msg || 'error desconocido'}`);
    }

    // 3) Descargar el PDF (sin abrir nueva pestaña)
    const blob = await res.blob(); // application/pdf
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    // nombre sugerido a partir del CSV seleccionado
    const baseName = file.name.replace(/\.csv$/i, '') || 'propuestas';
    a.href = url;
    a.download = `${baseName}-propuestas.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    // liberar el objeto URL
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
    toast.success('Propuestas descargadas');
  } catch (err) {
    console.error('❌ Error descargando propuestas desde CSV:', err);
    toast.error(`Error: ${err.message}`);
  }
}

async function safeText(res) {
  try {
    return await res.text();
  } catch {
    return '';
  }
}


</script>

<div class="space-y-4">
	<div class="flex justify-between items-center">
		<input
			type="text"
			placeholder="Buscar..."
			bind:value={searchQuery}
			class="border rounded px-3 py-1 w-full md:w-64"
		/>
		<div class="flex items-center">
			<Dialog bind:open>
				<DialogTrigger asChild>
					<Button><FileUp class="w-4 h-4" /> Subir</Button>
				</DialogTrigger>
				<DialogContent class="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Subir archivo CSV</DialogTitle>
					</DialogHeader>
					<div
						class="border-dashed border-2 border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 cursor-pointer flex flex-col items-center"
						on:click={() => document.getElementById('csv-upload').click()}
					>
						<CloudUpload class="w-16 h-16 text-gray-400 mb-2" />
						<p>Arrastra tu archivo aquí o haz clic para seleccionar uno</p>
						<input
							id="csv-upload"
							type="file"
							accept=".csv"
							class="hidden"
							on:change={(e) => (csvFile = e.target.files[0])}
						/>
					</div>
					{#if csvFile}
						<p class="mt-2 text-sm text-gray-600">Archivo seleccionado: {csvFile.name}</p>
					{/if}
				</DialogContent>
			</Dialog>

			<Button class="ml-2" onclick={downloadCsvData}>
				<Sheet class="w-4 h-4" /> Descargar
			</Button>

			<Button class="ml-2" onclick={pickCSV}>
				<Rows class="w-4 h-4" /> Propuestas
			</Button>
		</div>
	</div>

	<p class="text-sm text-gray-500">
		Mostrando {filteredData.length}
		{filteredData.length === 1 ? 'elemento' : 'elementos'}
	</p>

	<Table.Root>
		<Table.Header>
			<Table.Row class="text-center">
				<Table.Head class="text-center">
					<div class="flex justify-center">
						<Button
							variant="ghost"
							class="flex items-center justify-center gap-1 text-gray-800"
							onclick={() => setSortColumn('__originalIndex')}
						>
							<span>#</span>
							{#if sortColumn === '__originalIndex'}
								{#if sortOrder === 'asc'}
									<ChevronUp class="w-4 h-4 text-gray-500" />
								{:else}
									<ChevronDown class="w-4 h-4 text-gray-500" />
								{/if}
							{:else}
								<ChevronsUpDown class="w-4 h-4 text-gray-300" />
							{/if}
						</Button>
					</div>
				</Table.Head>
				{#each Object.values(columns) as column}
					<Table.Head class="text-center">
						<div class="flex justify-center">
							<Button
								variant="ghost"
								class="flex items-center justify-center gap-1 text-gray-800"
								onclick={() => setSortColumn(column.field)}
							>
								<span>{column.name}</span>
								{#if sortColumn === column.field}
									{#if sortOrder === 'asc'}
										<ChevronUp class="w-4 h-4 text-gray-500" />
									{:else}
										<ChevronDown class="w-4 h-4 text-gray-500" />
									{/if}
								{:else}
									<ChevronsUpDown class="w-4 h-4 text-gray-300" />
								{/if}
							</Button>
						</div>
					</Table.Head>
				{/each}

				{#if $selectedSidebarItem === SIDEBAR_ITEMS.HORARIOS}
					<Table.Head class="text-center">
						<div class="flex justify-center">
							<span>Propuesta</span>
						</div>
					</Table.Head>
				{/if}
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each visibleData as row, i}
				<Table.Row
					class={`text-center border-b border-gray-200 ${i % 2 === 1 ? 'bg-gray-50' : ''}`}
				>
					<Table.Cell>{row.__originalIndex + 1}</Table.Cell>
					{#each columns as column}
						<Table.Cell>{row[column.field] ?? '-'}</Table.Cell>
					{/each}

					{#if $selectedSidebarItem === SIDEBAR_ITEMS.HORARIOS}
						<Table.Cell colspan={Object.keys(columns).length + 1}>
							<Button
								class=" h-auto cursor-pointer text-sm px-2 py-1"
								onclick={() => downloadProposalPDF(row)}
							>
								<Download class="w-4 h-4" />
							</Button>
						</Table.Cell>
					{/if}
				</Table.Row>
			{/each}

			{#if visibleData.length === 0}
				<Table.Row>
					<Table.Cell colspan={Object.keys(columns).length + 1} class="text-center text-gray-500">
						Sin resultados
					</Table.Cell>
				</Table.Row>
			{/if}
		</Table.Body>
	</Table.Root>

	<div class="flex justify-between items-center mt-2">
		<Button
			variant="outline"
			onclick={() => handlePageChange(currentPage - 1)}
			disabled={currentPage === 1}
		>
			← Anterior
		</Button>
		<span>Página {currentPage} de {totalPages}</span>
		<Button
			variant="outline"
			onclick={() => handlePageChange(currentPage + 1)}
			disabled={currentPage === totalPages}
		>
			Siguiente →
		</Button>
	</div>
</div>
