<script>
    export let msg = "UnknownError";
</script>

<style>
    .error-wrapper {
        width: 100%;
        padding: 2rem;
    }
    .dinosaur {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 2rem;
    }
    .dinosaur img {
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
    <div class="dinosaur">
        <img src="./icon/dinosaur.svg" alt="Dinosaur" />
    </div>

    <div class="msg">{msg}</div>
</div>
