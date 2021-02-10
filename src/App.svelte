<header class="header">
  <h1>Calendar Link Generator</h1>
</header>
<main class="main-content">
  <Form on:submit={handleSubmit} />
  {#if !!eventUrls}
    <Result urls={eventUrls} />
  {/if}
</main>
<footer>

</footer>
<Toast />

<style>
  :global(body) {
    margin: 0;
  }
  .header {
    text-align: center;
    margin: 5rem 0 3rem;
  }
  .main-content {
    max-width: 600px;
    margin: 0 auto;
  }
</style>

<script>
import Form from "./Form.svelte";
import Result from "./Result.svelte";
import Toast from "./Toast.svelte";
import "flatpickr/dist/flatpickr.min.css";
import { CalanderLinkGenerator } from './calander-link-generator';

let eventUrls = null;

function handleSubmit({ detail: event }) {
  eventUrls = [{
      name: "Google",
      url: CalanderLinkGenerator.google(event),
    }, {
      name: "Yahoo",
      url: CalanderLinkGenerator.yahoo(event),
    }, {
      name: "Outlook",
      url: CalanderLinkGenerator.outlook(event),
    }, {
      name: "ICS",
      url: CalanderLinkGenerator.ics(event),
  }];
}
</script>