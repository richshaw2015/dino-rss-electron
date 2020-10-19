<script>
    export let msg = "UnknownError";
</script>

<style>
    .error-wrapper {
        width: 100%;
        padding: 2rem;
    }
    .net-error {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 2rem;
    }
    .net-error img {
        max-width: 96px;
    }
    .msg {
        color: #59595A;
        text-align: center;
	    margin-top: 3rem;
        font-size: 1.3rem;
        word-break: break-all;
    }
</style>

<div class="error-wrapper">
    <div class="net-error">
        <img src="./icon/neterr.svg" alt="netError" />
    </div>

    <div class="msg">{msg}</div>
</div>
