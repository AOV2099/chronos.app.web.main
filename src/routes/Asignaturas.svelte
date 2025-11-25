<script>
	import { ASIGNATURAS_URL, HORARIO_URL } from '@/store';
	import { onMount } from 'svelte';
	import DataTale from './DataTale.svelte';

    let horarios = [];
	async function getHorarios() {
		try {
			const result = await fetch(ASIGNATURAS_URL, {
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

    onMount(async () => {
        horarios = await getHorarios();
        console.log('Horarios obtenidos:', horarios);
    });
</script>

<div>

    {#if horarios.length > 0}
       <DataTale
            data={horarios}
            columns={[
                { name: 'Nombre', field: 'nombre' },
                { name: 'Plantel', field: 'plantel' },
                { name: 'Carrera', field: 'carrera' },
                { name: 'Plan', field: 'plan' },
                { name: 'Clave', field: 'clave' },
                { name: 'Hrs Teóricas', field: 'horas_teoricas' },
                { name: 'Hrs Prácticas', field: 'horas_practicas' },
                { name: 'Tipo', field: 'tipo' }
            ]}
        />
    {:else}
        <p>No hay horarios disponibles.</p>
    {/if }
</div>

