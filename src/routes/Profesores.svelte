<script>
	import { PROFESORES_URL } from '@/store';
	import { onMount } from 'svelte';
	import DataTale from './DataTale.svelte';

    let horarios = [];
	async function getAsignaturas() {
		try {
			const result = await fetch(PROFESORES_URL, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!result.ok) {
				throw new Error('Error al obtener los PROFESORES');
			} else {
				return await result.json();
			}
		} catch (error) {
			console.error('Error al obtener los PROFESORES:', error);
			return [];
		}
	}

    onMount(async () => {
        horarios = await getAsignaturas();
        console.log('PROFESORES obtenidos:', horarios);
    });
</script>

<div>

    {#if horarios.length > 0}
       <DataTale
            data={horarios}
            columns={[
                { name: 'Nombre', field: 'profesor' },
                { name: 'RFC', field: 'rfc' },
                { name: 'Num. Trabajador', field: 'numTrabajador' },
                { name: 'Domicilio', field: 'domicilio' },
                { name: 'Telefono', field: 'telefono' },
                { name: 'E-Mail', field: 'correo-e' },
                { name: 'Tipo', field: 'tipo' },
                { name: 'Categoría', field: 'categoria' }
            ]}
        />
    {:else}
        <p>No hay horarios disponibles.</p>
    {/if }
</div>

