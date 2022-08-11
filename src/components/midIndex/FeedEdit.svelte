<script>
    import { apiReq } from '../utils/req.js'
    import { shortToast, warnToast, i18n } from '../utils/helper.js'
    import { feedToEdit } from '../utils/store.js'

    let feedTitle 
    let feedAuthor
    let feedId
    
    feedToEdit.subscribe(feed => {
        if (Object.keys($feedToEdit).length > 0) {
            feedTitle = $feedToEdit.custom.title || $feedToEdit.title
            feedAuthor = $feedToEdit.custom.author || $feedToEdit.author
            feedId = $feedToEdit.id
            
            const instanse = M.Modal.init(document.querySelector('#omr-modal-feed-edit'), {
                inDuration: 0,
                outDuration: 0,
                opacity: 0.5,
                endingTop: "15%"
            });
            instanse.open()
            console.log("open edit window")
        }
        return feed
    });

    function handleEditSubmit() {
        if (feedId && feedTitle.length < 64 && feedAuthor.length < 32) {
            apiReq('/api/feed/custom', {feed_id: feedId, feed_title: feedTitle, feed_author: feedAuthor}).then( rsp => {
                if (rsp.code === 0) {
                    shortToast(i18n("edit.success"))
                    
                    try {
                        M.Modal.getInstance(document.querySelector('#omr-modal-feed-edit')).close()
                    } catch (e) {}
                } else {
                    warnToast(i18n("unknown.error"))
                }
            }).catch(err => {
                warnToast(err)
            })
        } else {
            warnToast(i18n('input.too.long'))
        }
    }
</script>

<style>
    #omr-modal-feed-edit {
        width: 640px;
        padding: 24px;
        left: 64px;
    }
    .modal-title {
        margin-bottom: 1.6rem;
    }
    .auto-active {
        -webkit-transform: translateY(-14px) scale(0.8) !important;
        transform: translateY(-14px) scale(0.8) !important;
    }
</style>

<div id="omr-modal-feed-edit" class="modal">
    <div class="modal-title"><i class="material-icons">edit</i> {i18n('edit.feed')}</div>

    <div class="row col s12">
        <div class="input-field col s7">
            <i class="material-icons prefix">translate</i>
            <input id="omr-feed-name" class="validate" type="text" data-length="64" maxlength="64" bind:value={feedTitle}>
            <label for="omr-feed-name" class="active auto-active">{i18n('name')}</label>
        </div>
    
        <div class="input-field col s5">
            <i class="material-icons prefix">person</i>
            <input id="omr-feed-author" class="validate" type="text" data-length="32" maxlength="32" bind:value={feedAuthor}>
            <label for="omr-feed-author" class="active auto-active">{i18n('author')}</label>
        </div>
    </div>

    <div class="modal-footer">
        <button class="modal-close btn waves-effect waves-light btn-small cancel-btn">{i18n('cancel')}</button>
        <button class="btn waves-effect waves-light btn-small" on:click={handleEditSubmit}>{i18n('submit')}</button>
    </div>
</div>
