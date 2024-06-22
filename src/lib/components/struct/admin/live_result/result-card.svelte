<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import BarChart from './bar-chart.svelte';
</script>

<div class="grid gap-[10px] rounded-lg border-[1px] border-secondary p-[1rem]">
	<h4 class="scroll-m-20 text-xl font-semibold tracking-tight">Senators</h4>

	<div class="h-[20dvh]">
		<BarChart />
	</div>

	<div class="grid gap-[10px]">
		<div class="grid grid-cols-[70%,30%]">
			<span>
				<p class="font-semibold text-muted-foreground">Name</p>
			</span>

			<span>
				<p class="mx-auto max-w-fit text-center font-semibold text-muted-foreground">Count</p>
			</span>
		</div>

		<div class="grid max-h-[40dvh] gap-[10px] overflow-auto">
			{#each Array(20) as _}
				<div class="grid grid-cols-[70%,30%]">
					<span class="flex items-center gap-[5px]">
						<Avatar.Root>
							<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
							<Avatar.Fallback>CN</Avatar.Fallback>
						</Avatar.Root>
						<p class="font-semibold text-muted-foreground">Eviota, Mike John B</p>
					</span>

					<span>
						<p class="mx-auto max-w-fit text-center font-semibold text-muted-foreground">30</p>
					</span>
				</div>
			{/each}
		</div>
	</div>
</div>
