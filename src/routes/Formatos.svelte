<script>
	import Button from '@/lib/components/ui/button/button.svelte';
	import * as ContextMenu from '$lib/components/ui/context-menu/index.js';
	import {
		FileBox,
		FileSpreadsheet,
		FileText,
		FileType,
		CloudUpload,
		Trash2,
		Download
	} from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	let selectedFile = null;

	function triggerFileInput() {
		document.getElementById('upload-input').click();
	}

	function handleFileChange(event) {
		selectedFile = event.target.files[0];
		// Aquí podrías procesar el archivo si quieres
		console.log('Archivo seleccionado:', selectedFile?.name);
	}

	const dummyContent =
		'Este es un archivo de demostración generado para descarga desde la vista de formatos.';

	function downloadDummy(name) {
		const blob = new Blob([dummyContent], { type: 'text/plain;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `${name}.txt`;
		link.click();
		URL.revokeObjectURL(url);
	}

	let formats = [
		{ name: 'Plan de estudios Filosofía', icon: FileText, color: 'text-blue-600' },
		{ name: 'Presupuesto Anual FCPyS', icon: FileSpreadsheet, color: 'text-green-600' },
		{ name: 'Calendario Escolar 2025', icon: FileBox, color: 'text-orange-500' },
		{ name: 'Estadísticas CCH', icon: FileSpreadsheet, color: 'text-green-600' },
		{ name: 'Reglamento General UNAM', icon: FileText, color: 'text-blue-600' },
		{ name: 'Presentación DGIRE', icon: FileBox, color: 'text-orange-500' },
		{ name: 'Informe de Rectoría', icon: FileType, color: 'text-gray-700' },
		{ name: 'Syllabus Historia Moderna', icon: FileText, color: 'text-blue-600' },
		{ name: 'Cuadro Comparativo Carreras', icon: FileSpreadsheet, color: 'text-green-600' },
		{ name: 'Proyecto Aula Virtual', icon: FileBox, color: 'text-orange-500' },
		{ name: 'Estadísticas Ingreso 2024', icon: FileSpreadsheet, color: 'text-green-600' },
		{ name: 'Guía de Ética Universitaria', icon: FileText, color: 'text-blue-600' },
		{ name: 'Mapa Interactivo Facultades', icon: FileType, color: 'text-gray-700' },
		{ name: 'Convocatoria Servicio Social', icon: FileText, color: 'text-blue-600' },
		{ name: 'Informe Final PAPIIT', icon: FileType, color: 'text-gray-700' }
	];

	function removeFormat(name) {
		toast.success(`Formato "${name}" eliminado correctamente. (POR IMPLEMENTAR)`);
	}
</script>

<!-- Botón de subida -->
<div class="flex justify-end items-center px-6 pt-4">
	<Button
		class="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
		onclick={triggerFileInput}
	>
		<CloudUpload class="w-5 h-5" />
		Subir archivo
	</Button>
	<input id="upload-input" type="file" class="hidden" on:change={handleFileChange} />
</div>

<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 p-6">
	{#each formats as format (format.name)}
		<ContextMenu.Root>
			<ContextMenu.Trigger>
				<div
					class="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-110 hover:bg-gray-100"
					on:click={() => downloadDummy(format.name)}
				>
					<svelte:component this={format.icon} class={`w-12 h-12 ${format.color}`} />
					<span class="text-sm font-medium text-center">{format.name}</span>
				</div>
			</ContextMenu.Trigger>
			<ContextMenu.Content
				class="z-50 rounded-md border border-gray-200 bg-white shadow-md p-1 text-sm"
			>
				<ContextMenu.Item
					class="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer transition"
					onclick={() => downloadDummy(format.name)}
				>
					<Download class="w-4 h-4 text-gray-500" />
					Descargar
				</ContextMenu.Item>
				<ContextMenu.Item
					class="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer transition"
					onclick={() => removeFormat(format.name)}
				>
					<Trash2 class="w-4 h-4" />
					Eliminar
				</ContextMenu.Item>
			</ContextMenu.Content>
		</ContextMenu.Root>
	{/each}
</div>
