<script>
    import { isApiLoading, isForceLoading } from '../utils/store.js'
</script>

<style>
  .preloader-bg {
    width: 100%;
    height: 100%;
    background:rgba(0,0,0,0.5);
    position: absolute;
    top: 0;
    left: 0;
    z-index: 9998;
  }
</style>

{#if $isForceLoading}
  <div class="preloader-bg"></div>
{/if}

<div class="preloader-wrapper big {$isApiLoading ? 'active' : ''}" id="omr-loader">
    <div class="spinner-layer spinner-blue">
        <div class="circle-clipper left">
          <div class="circle"></div>
        </div><div class="gap-patch">
          <div class="circle"></div>
        </div><div class="circle-clipper right">
          <div class="circle"></div>
        </div>
      </div>

      <div class="spinner-layer spinner-red">
        <div class="circle-clipper left">
          <div class="circle"></div>
        </div><div class="gap-patch">
          <div class="circle"></div>
        </div><div class="circle-clipper right">
          <div class="circle"></div>
        </div>
      </div>

      <div class="spinner-layer spinner-yellow">
        <div class="circle-clipper left">
          <div class="circle"></div>
        </div><div class="gap-patch">
          <div class="circle"></div>
        </div><div class="circle-clipper right">
          <div class="circle"></div>
        </div>
      </div>

      <div class="spinner-layer spinner-green">
        <div class="circle-clipper left">
          <div class="circle"></div>
        </div><div class="gap-patch">
          <div class="circle"></div>
        </div><div class="circle-clipper right">
          <div class="circle"></div>
        </div>
      </div>
</div>
