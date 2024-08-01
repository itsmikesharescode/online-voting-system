<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { createCandidateSchema, type CreateCandidateSchema } from '$lib/schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { LoaderCircle, Rabbit, X } from 'lucide-svelte';
	import type { User } from '@supabase/supabase-js';
	import * as Select from '$lib/components/ui/select';
	import type { Candidate, Position, ResultModel } from '$lib/types';
	import { fromCandidatesRouteState } from '$lib/runes/CandidatesRoute.svelte';

	interface PropType {
		createCandidateForm: SuperValidated<Infer<CreateCandidateSchema>>;
		positions: Position[] | null;
		user: User | null;
	}

	const { createCandidateForm, positions, user }: PropType = $props();

	const candidateRoute = fromCandidatesRouteState();

	let open = $state(false);

	const form = superForm(createCandidateForm, {
		validators: zodClient(createCandidateSchema),
		invalidateAll: false,
		onUpdate({ result }) {
			const { status, data } = result as ResultModel<{ msg: string; data: Candidate[] }>;

			switch (status) {
				case 200:
					toast.success('Create Candidate', {
						description: data.msg,
						action: {
							label: 'Undo',
							onClick: () => {}
						}
					});
					candidateRoute.setCandidateArray(data.data);
					open = false;
					break;
				case 401:
					toast.error('Create Candidate', {
						description: data.msg,
						action: {
							label: 'Undo',
							onClick: () => {}
						}
					});
					break;
			}
		}
	});

	const { form: formData, enhance, submitting } = form;

	const selectedPositon = $derived({
		label: $formData.selectedPosition,
		value: $formData.selectedPosition
	});
</script>

<Button onclick={() => (open = true)}>Add Candidate</Button>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<button
			onclick={() => (open = false)}
			class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
		>
			<X />
		</button>
		<AlertDialog.Header>
			<AlertDialog.Title>Add Candidate</AlertDialog.Title>
			<AlertDialog.Description>
				This will add a candidate that voters can vote on.
			</AlertDialog.Description>
		</AlertDialog.Header>

		<form method="POST" action="?/createCandidate" use:enhance class="grid gap-[10px]">
			<div class="h-[70dvh] overflow-auto p-[10px] sm:h-fit">
				<Form.Field {form} name="selectedPosition">
					<Form.Control let:attrs>
						<Form.Label>Positions</Form.Label>
						<Select.Root
							selected={selectedPositon}
							onSelectedChange={(v) => {
								v && ($formData.selectedPosition = v.value);
							}}
						>
							<Select.Trigger {...attrs} class="w-full">
								<Select.Value placeholder="Select Position" />
							</Select.Trigger>
							<Select.Content>
								{#if positions?.length}
									{#each positions as position}
										<Select.Item value={position.position_name}>
											{position.position_name}
										</Select.Item>
									{/each}
								{:else}
									<div class=" flex flex-col items-center justify-center p-[20px]">
										<Rabbit class="mx-auto h-[150px] w-[150px] text-muted-foreground" />
										<p class="text-center text-muted-foreground">
											There is no available positions. Create one to add candidate.
										</p>

										<Button variant="link" class="mx-auto max-w-fit" href="/admin/positions"
											>Create Position Here</Button
										>
									</div>
								{/if}
							</Select.Content>
						</Select.Root>
						<input
							hidden
							value={JSON.stringify(
								positions?.filter((v) => v.position_name === $formData.selectedPosition)[0]
							)}
							name={attrs.name}
						/>
					</Form.Control>
					<Form.Description>Select the position.</Form.Description>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="displayName">
					<Form.Control let:attrs>
						<Form.Label>Display Name</Form.Label>
						<Input type="text" {...attrs} bind:value={$formData.displayName} />
					</Form.Control>
					<Form.Description>Enter the display name.</Form.Description>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="motto">
					<Form.Control let:attrs>
						<Form.Label>Candidate Motto</Form.Label>
						<Textarea {...attrs} bind:value={$formData.motto} />
					</Form.Control>
					<Form.Description>Enter the motto.</Form.Description>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<div class="flex justify-end px-[10px]">
				<Form.Button disabled={$submitting}>
					{#if $submitting}
						<LoaderCircle class="animate-spin" />
					{:else}
						Add Candidate
					{/if}
				</Form.Button>
			</div>
		</form>
	</AlertDialog.Content>
</AlertDialog.Root>
