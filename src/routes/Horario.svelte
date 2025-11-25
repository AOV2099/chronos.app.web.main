<script>
	import { HORARIO_URL } from '@/store';
	import { onMount } from 'svelte';
	import DataTale from './DataTale.svelte';

	let horarios = [];
	async function getHorarios() {
		try {
			const result = await fetch(HORARIO_URL, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!result.ok) {
				throw new Error('Error al obtener los horarios');
			} else {
				return await result.json();
			}
		} catch (error) {
			console.error('Error al obtener los horarios:', error);
			return [];
		}
	}

	function arrangeScheduleInDays(scheduleString) {
		const daysMap = {
			LU: 'LUN',
			MA: 'MAR',
			MI: 'MIE',
			JU: 'JUE',
			VI: 'VIE',
			SA: 'SAB',
			DO: 'DOM'
		};

		const result = {};

		const blocks = scheduleString.split(',').map((s) => s.trim());

		for (const block of blocks) {
			const tokens = block.split(/\s+/);
			const timeRange = tokens.slice(-3).join(' ');
			const days = tokens.slice(0, -3);

			for (const day of days) {
				const dayKey = daysMap[day] || day;
				if (!result[dayKey]) {
					result[dayKey] = [];
				}
				result[dayKey].push(timeRange);
			}
		}

		return result;
	}

	onMount(async () => {
		const rawHorarios = await getHorarios();

		horarios = rawHorarios.map((item) => {
			const horarioDetallado = arrangeScheduleInDays(item.horario || '');

			return {
				...item,
				cveAsignatura: String(item.cveAsignatura ?? '').padStart(4, '0'),
				LUN: horarioDetallado.LUN?.join(', ') || '',
				MAR: horarioDetallado.MAR?.join(', ') || '',
				MIE: horarioDetallado.MIE?.join(', ') || '',
				JUE: horarioDetallado.JUE?.join(', ') || '',
				VIE: horarioDetallado.VIE?.join(', ') || '',
				SAB: horarioDetallado.SAB?.join(', ') || '',
				DOM: horarioDetallado.DOM?.join(', ') || ''
			};
		});
	});
</script>

<div>
	{#if horarios.length > 0}
		<DataTale
			data={horarios}
			columns={[
				{ name: 'Profesor', field: 'profesor' },
				//{ name: 'RFC', field: 'rfc' },
				{ name: 'Num. Trabajador', field: 'numTrabajador' },
				//{ name: 'Domicilio', field: 'domicilio' },
				//{ name: 'Teléfono', field: 'telefono' },
				//{ name: 'Correo', field: 'correo-e' },
				//{ name: 'Tipo', field: 'tipo' },
				//{ name: 'Causa', field: 'causa' },
				//{ name: 'Categoría', field: 'categoria' },
				{ name: 'Clave Asignatura', field: 'cveAsignatura' },
				{ name: 'Plan de Estudios', field: 'planEstudios' },
				{ name: 'Nombre Asignatura', field: 'nombreAsignatura' },
				{ name: 'Grupo', field: 'grupo' },
				//{ name: 'Salón', field: 'salon' },
				{ name: 'Alumnos', field: 'almunos' },
				//{ name: 'Horario', field: 'horario' },
				{ name: 'LUN', field: 'LUN' },
				{ name: 'MAR', field: 'MAR' },
				{ name: 'MIE', field: 'MIE' },
				{ name: 'JUE', field: 'JUE' },
				{ name: 'VIE', field: 'VIE' },
				{ name: 'SAB', field: 'SAB' },
				{ name: 'DOM', field: 'DOM' },
				{ name: 'Hrs Teóricas', field: 'horasTeoricas' },
				{ name: 'Hrs Prácticas', field: 'horasPracticas' },
				{ name: 'Hrs Totales', field: 'horasTotal' },
				{ name: 'Hrs Teóricas Totales', field: 'horasTeoricasTotal' },
				{ name: 'Hrs Prácticas Totales', field: 'horasPracticasTotal' },
				{ name: 'Hrs Totales Totales', field: 'horasTotalTotal' },
				{ name: 'Observaciones', field: 'observaciones' },
				//{ name: 'Título', field: 'titulo' },
				//{ name: 'Día Inicio', field: 'diaIni' },
				//{ name: 'Mes Inicio', field: 'mesIni' },
				//{ name: 'Año Inicio', field: 'anoIni' },
				//{ name: 'Día Fin', field: 'diaFin' },
				//{ name: 'Mes Fin', field: 'mesFin' },
				//{ name: 'Año Fin', field: 'anoFin' },
				{ name: 'Lab', field: 'lab' }
			]}
		/>
	{:else}
		<p>No hay horarios disponibles.</p>
	{/if}
</div>
