<script lang="ts">
  import CreateVoter from '$lib/components/struct/admin/voters/create-voter.svelte';
  import RenderVoters from '$lib/components/struct/admin/voters/render-voters.svelte';
  import { routeState } from '$lib/runes/Route.svelte.js';
  import { userState } from '$lib/runes/userState.svelte.js';

  import { fromVotersRouteState } from '$lib/runes/VotersRoute.svelte.js';

  const { data } = $props();

  const route = routeState();
  route.setRoute('/admin/voters');

  const user = userState();
  const votersRoute = fromVotersRouteState();
</script>

<div class="min-h-screen border-slate-700 p-[1rem] md:border-l-[1px]">
  <CreateVoter createVoterForm={data.createVoterForm} user={user.getUser()} />

  <div class="mt-[20px]">
    <RenderVoters
      voters={votersRoute.getVotersArray()}
      user={user.getUser()}
      updateVoterForm={data.updateVoterForm}
    />
  </div>
</div>
