<script>
	import {
		Bolt,
		BookA,
		BookOpen,
		CalendarSearch,
		ClipboardPlus,
		FileSearch,
		GraduationCap,
		LayoutDashboard,
		LogOut,
		TimerReset
	} from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { selectedSidebarItem, SIDEBAR_ITEMS } from '@/store';

	// Dividir por grupos visuales
	const OPCIONES = Object.entries(SIDEBAR_ITEMS).slice(0, 6);
	const HERRAMIENTAS = Object.entries(SIDEBAR_ITEMS).slice(6);

    
	function handleOptionClick(item = 'test') {
		//console.log('Handler ejecutado', item); // <- debería imprimir el objeto entero
		if (!item) {
			console.error('item es undefined');
			return;
		}
		selectedSidebarItem.set(item);
	}
</script>

<div class="h-full flex flex-col">
	<!-- Header -->
	<div class="flex items-center gap-2 p-3 border-b border-gray-300">
		<TimerReset class="w-6 h-6 text-gray-600" />
		<span class="text-lg font-semibold text-gray-800">CHRONOS V3</span>
	</div>

	<!-- Opciones principales -->
	<div class="p-2 space-y-0">
		<div class="text-gray-600 text-sm font-semibold ps-3 mt-5">Opciones</div>

		{#each OPCIONES as [key, value]}
			<Button
				variant="ghost"
				class="w-full justify-start mt-2"
				onclick={() => handleOptionClick(value)}
			>
				<svelte:component this={value.icon} class="w-5 h-5 me-2 text-gray-600" />
				<span class="text-gray-800">{value.label}</span>
			</Button>
		{/each}
	</div>

	<!-- Opciones flotantes abajo -->
	<div class="mt-auto p-2 pb-8">
		<div class="text-gray-600 text-sm font-semibold ps-3 mt-5">Herramientas</div>

		{#each HERRAMIENTAS as [key, value]}
			<Button
				variant="ghost"
				class="w-full justify-start mt-2"
				onclick={() => handleOptionClick(value)}
			>
				<svelte:component this={value.icon} class="w-5 h-5 me-2 text-gray-600" />
				<span class="text-gray-800">{value.label}</span>
			</Button>
		{/each}
	</div>
</div>

