<script>
	import { selectedSidebarItem, SIDEBAR_ITEMS } from '@/store';
	import { TimerReset } from 'lucide-svelte';
	import Horario from './Horario.svelte';
	import Asignaturas from './Asignaturas.svelte';
	import Profesores from './Profesores.svelte';
	import Formatos from './Formatos.svelte';
</script>

<div class=" h-full flex flex-col">
	<!-- Header -->
	<div class="flex items-center gap-2 p-3 border-b border-gray-300">
		<svelte:component
			this={$selectedSidebarItem.icon || TimerReset}
			class="w-6 h-6 text-gray-600"
		/>
		<span class="text-lg font-semibold text-gray-800">
			{$selectedSidebarItem.label || 'CHRONOS V4'}
		</span>
	</div>

	<div class="p-6">
		{#if $selectedSidebarItem.label === SIDEBAR_ITEMS.HORARIOS.label}
			<Horario />
		{:else if $selectedSidebarItem.label === SIDEBAR_ITEMS.ASIGNATURAS.label}
			<Asignaturas />
		{:else if $selectedSidebarItem.label === SIDEBAR_ITEMS.ACADEMICOS.label}
			<Profesores />
		{:else if $selectedSidebarItem.label === SIDEBAR_ITEMS.FORMATOS.label}
			<Formatos />
		{/if}
	</div>
</div>
