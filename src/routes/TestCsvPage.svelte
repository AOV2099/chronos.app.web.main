<script>
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { UploadCloud, FileSpreadsheet, X } from 'lucide-svelte';
	import { CSV_TEMPLATE_URL, PROPUESTAS_GLOBAL_URL } from '@/store';
	import { toast } from 'svelte-sonner';

	let dragActive = false;
	let selectedFile = null;
	let error = '';
	let fileInput; // input nativo oculto
	let isProcessing = false;

	function handleDragOver(event) {
		event.preventDefault();
		dragActive = true;
	}

	function handleDragLeave(event) {
		event.preventDefault();
		dragActive = false;
	}

	function handleDrop(event) {
		event.preventDefault();
		dragActive = false;

		const file = event.dataTransfer?.files?.[0];
		if (file) {
			processFile(file);
		}
	}

	function handleBrowseClick() {
		if (fileInput) {
			fileInput.click();
		}
	}

	function handleFileChange(event) {
		const file = event.target.files?.[0];
		if (file) {
			processFile(file);
		}
	}

	function processFile(file) {
		error = '';

		const isCsv =
			file.name.toLowerCase().endsWith('.csv') ||
			file.type === 'text/csv' ||
			file.type === 'application/vnd.ms-excel';

		if (!isCsv) {
			selectedFile = null;
			error = 'El archivo debe ser un CSV (.csv)';
			return;
		}

		selectedFile = file;
		toast.success('Archivo CSV cargado. Ahora puedes descargar las propuestas.');
	}

	function clearFile() {
		selectedFile = null;
		error = '';
		if (fileInput) {
			fileInput.value = '';
		}
	}

	async function downloadProposals() {
		if (!selectedFile) {
			error = 'Primero carga un archivo CSV.';
			return;
		}

		isProcessing = true;
		await openAllPropuestasFromCSV(selectedFile);
		isProcessing = false;
	}

	async function openAllPropuestasFromCSV(file) {
		try {
			const csvText = await file.text();

			const res = await fetch(`${PROPUESTAS_GLOBAL_URL}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json; charset=utf-8' },
				body: JSON.stringify({ csv: csvText, isZip: true }) // aquí ya pedimos ZIP
			});

			if (!res.ok) {
				const msg = await safeText(res);
				throw new Error(`API respondió ${res.status}: ${msg || 'error desconocido'}`);
			}

			const blob = await res.blob();
			const contentType = res.headers.get('content-type') || '';

			// Detectar si viene ZIP o PDF según el Content-Type
			const isZip = contentType.includes('application/zip');
			const ext = isZip ? 'zip' : 'pdf';

			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			const baseName = file.name.replace(/\.csv$/i, '') || 'propuestas';

			a.href = url;
			a.download = `${baseName}-propuestas.${ext}`; // 👈 ya no está forzado a .pdf
			document.body.appendChild(a);
			a.click();
			a.remove();

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

	async function downloadExampleCSV() {
		try {
			// Mejor usar ruta relativa si el frontend vive en el mismo host:
			const res = await fetch(CSV_TEMPLATE_URL);

			if (!res.ok) {
				const msg = await res.text().catch(() => '');
				throw new Error(`API respondió ${res.status}: ${msg || 'error desconocido'}`);
			}

			// Si tu endpoint ya responde text/csv, esto está bien:
			const blob = await res.blob();

			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');

			// Nombre del archivo de ejemplo
			a.href = url;
			a.download = 'ejemplo-propuestas.csv';

			document.body.appendChild(a);
			a.click();
			a.remove();

			setTimeout(() => URL.revokeObjectURL(url), 60_000);

			toast.success('CSV de ejemplo descargado');
		} catch (error) {
			console.error('❌ Error al descargar CSV:', error);
			toast.error('Error al descargar CSV: ' + (error?.message || error));
		}
	}
</script>

<div class="p-6">
	<hr />
	<div class="flex justify-between items-center">
		<div class="text-2xl font-semibold mb-4 mt-4">
			CARGA DE ARCHIVO CSV DE PROPUESTAS  
		</div>

		<div>
			<Button onclick={downloadExampleCSV}>Descargar CSV de ejemplo</Button>
		</div>
	</div>
	<hr />
</div>

<!-- contenedor centrado -->
<div class="min-h-[60vh] w-full flex justify-center items-center">
	<section class="px-6 pb-10">
		<Card.Root class="max-w-3xl mx-auto">
			<Card.Header>
				<Card.Title>Cargar archivo CSV</Card.Title>
				<Card.Description>
					Arrastra tu archivo de propuestas o selecciónalo desde tu computadora. Luego haz clic en
					"Descargar propuestas".
				</Card.Description>
			</Card.Header>

			<Card.Content class="space-y-4">
				<!-- zona drag & drop -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					class={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 text-center transition 
                        ${dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/30 bg-muted/40'}`}
					on:dragover|preventDefault={handleDragOver}
					on:dragenter|preventDefault={handleDragOver}
					on:dragleave={handleDragLeave}
					on:drop={handleDrop}
				>
					<UploadCloud class="w-10 h-10 mb-1" />

					<p class="font-medium">
						Arrastra aquí tu archivo <span class="font-semibold">.csv</span>
					</p>
					<p class="text-sm text-muted-foreground">
						O bien, selecciónalo manualmente desde tu dispositivo.
					</p>

					<div class="mt-3 flex flex-col sm:flex-row gap-2 items-center justify-center">
						<Button
							type="button"
							variant="default"
							onclick={handleBrowseClick}
							disabled={isProcessing}
						>
							Elegir archivo
						</Button>
					</div>

					<!-- Input real (nativo, oculto) -->
					<input
						type="file"
						accept=".csv,text/csv"
						class="hidden"
						bind:this={fileInput}
						on:change={handleFileChange}
					/>
				</div>

				{#if error}
					<p class="text-sm text-red-500">{error}</p>
				{/if}

				{#if selectedFile}
					<div class="mt-4 border rounded-lg p-4 bg-background flex flex-col gap-3">
						<div class="flex items-start justify-between gap-3">
							<div class="flex items-center gap-2">
								<FileSpreadsheet class="w-5 h-5" />
								<div class="text-left">
									<p class="text-sm font-semibold break-all">
										{selectedFile.name}
									</p>
									<p class="text-xs text-muted-foreground">
										{(selectedFile.size / 1024).toFixed(1)} KB
									</p>
								</div>
							</div>

							<Button
								type="button"
								variant="ghost"
								size="icon"
								class="h-8 w-8"
								onclick={clearFile}
								disabled={isProcessing}
							>
								<X class="w-4 h-4" />
							</Button>
						</div>

						<div class="flex justify-end">
							<Button
								type="button"
								variant="default"
								onclick={downloadProposals}
								disabled={isProcessing}
							>
								{#if isProcessing}
									Generando PDF...
								{:else}
									Descargar propuestas
								{/if}
							</Button>
						</div>
					</div>
				{/if}
			</Card.Content>
		</Card.Root>
	</section>
</div>
