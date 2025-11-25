<script>
	import { onMount } from "svelte";
	import MainContent from "./MainContent.svelte";
	import Sidebar from "./Sidebar.svelte";
  import { toast, Toaster } from "svelte-sonner";
	import TestCsvPage from "./TestCsvPage.svelte";

    onMount(() => {
       toast.info("LogIn exitoso", {
            description: "Bienvenido a Chronos V3",
            duration: 5000,
            style: {
                backgroundColor: "#f0f4f8",
                color: "#333"
            }
        });
    });

</script>

<Toaster />


<div class="p-6 min-h-screen bg-gray-300">

    <div class="border border-gray-300 rounded-lg bg-white h-full grid grid-cols-12 shadow-xl min-h-[calc(100vh-3rem)] overflow-hidden">

        <!--
        <div class="col-span-2 bg-gray-50 border-r border-gray-300">
            <Sidebar />
        </div>

         <div class="col-span-10 ">
            <MainContent />
        </div> -->

        <div class="col-span-12 ">
                 <TestCsvPage />


        </div>


    </div>
</div>