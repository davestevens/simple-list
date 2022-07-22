<script lang="ts">
</script>
  
<style>
  nav {
    width: 100%;
    height: 5rem;
    background-color: grey;
    color: #fff;
  }

  .container {
    max-width: 40rem;
    padding: 0.5rem;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>

<nav>
  <div class="container">
    <slot></slot>
  </div>
</nav>
