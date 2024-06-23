<script lang="ts">
	import * as Select from '$lib/components/ui/select';
</script>

<Select.Root>
	<Select.Trigger class="w-full">
		<Select.Value placeholder="" />
	</Select.Trigger>
	<Select.Content>
		<Select.Item value="senator">Senator</Select.Item>
		<Select.Item value="president">President</Select.Item>
		<Select.Item value="vicePresident">Vice President</Select.Item>
	</Select.Content>
</Select.Root>
