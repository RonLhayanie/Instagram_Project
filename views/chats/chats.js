// constants
const searchModel                    = document.getElementById('search-modal')
const overlay                        = document.getElementById('overlay')
const sidebarSearchInput             = document.getElementById('sidebar-search-input')
const newMessageModal                = document.getElementById('new-message-modal')
const changeGroupNameModal           = document.getElementById('change-group-name-modal')

let   currentSelctedUsers            = []
const AccountUsername                = JSON.parse(localStorage.getItem('currentUsername'))
             

const debounceSearch_newMessageModal = debounce(uploadSearchResults_NewMessageModal, 400)
const debounceSearch_searchModal     = debounce(uploadSearchResults_searchModal,     400)
const debounceSearch_navingation     = debounce(uploadSearchResults_navigation,      400)

const groupSearchFilters = {
    Imanage: false,
    membersCount: {
        _3_5: false,
        _5_10: false,
        _10_20: false,
        _20plus: false,
    },
    activityLevel: "any"
}

console.log(AccountUsername + "'s console")

// load all chats
document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('/chats/getArray', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            username: AccountUsername
        })
    })
    const chats  = await response.json()

    chats.forEach(async (chat) => {

        // owner and viceowner avatars fetch
        const ownerAvatar = await avatarOf(AccountUsername)
        const viceownerAvatar = await avatarOf(chat.viceowner)
        const chatName = chat.name || chat.members.filter(m => m != AccountUsername).join(', ')

        // is group
        if(chat.members.length > 2) {
            const chatDiv = document.createElement('div')
            chatDiv.classList.add('chat', 'group-chat')
            chatDiv.innerHTML = await groupchatHTML(viceownerAvatar, ownerAvatar, chatName, chat.members)

            document.getElementById('scroller').appendChild(chatDiv)
            chatDiv.addEventListener('click', async () => {
                await openChat(chatDiv, chat) 
            })
            chatDiv.dataset._id = chat._id
        }

        // is dialog
        else {
            const chatDiv = document.createElement('div')
            chatDiv.classList.add('chat')
            chatDiv.innerHTML = await dialogchatHTML(viceownerAvatar, chat.members.filter(m => m != AccountUsername)[0])

            document.getElementById('scroller').appendChild(chatDiv)
            chatDiv.addEventListener('click', async () => {
                await openChat(chatDiv, chat) 
            })
            chatDiv.dataset._id = chat._id
        }
    })
})

// load account personal details
document.addEventListener('DOMContentLoaded', async () => {
    const avatar = await avatarOf(AccountUsername)
    document.querySelector('#my-note img').src = avatar
    document.querySelector('#profile img').src = avatar
    console.log(avatar)

    document.querySelector('#username p').innerText = AccountUsername
})

// redirections
const homepageRedirectionsIDs = ['home', 'instagram-logo']
homepageRedirectionsIDs.forEach(elID => {
    document.getElementById(elID).addEventListener('click', () => {
        window.location.href = '../feed/feed.html'
    })
})

document.getElementById('profile').addEventListener('click', () => {
    window.location.href = '../profile/profile.html'
})

// open group search
document.getElementById('search-groups').addEventListener('click', async () => {
    if(document.getElementById('chats-search-results-wrapper').classList.contains('hidden')) {
        // open results section
        document.getElementById('chats-search-results-wrapper').classList.remove('hidden')
        document.getElementById('chats-wrapper').classList.add('hidden')

        document.querySelector('.search-box-magniglass').classList.add('hidden')
        document.querySelector('.search-box-arrow').classList.remove('hidden')
        document.querySelector('.search-box-filter').classList.remove('hidden')
        document.getElementById('search-groups').classList.add('searching')

        await debounceSearch_navingation('')
    }
})

// close group search
document.querySelector('.search-box-arrow').addEventListener('click', async () => {  
        
    document.getElementById('chats-search-results-wrapper').classList.add('hidden')
    document.getElementById('chats-wrapper').classList.remove('hidden')

    document.querySelector('.search-box-magniglass').classList.remove('hidden')
    document.querySelector('.search-box-arrow').classList.add('hidden')
    document.querySelector('.search-box-filter').classList.add('hidden')
    document.getElementById('search-groups').classList.remove('searching')

    document.getElementById('filter-dropdown').classList.add('hidden')
    document.getElementById('activity-any').checked = true
    document.getElementById('onlyMyGroups').checked = false
    document.getElementById('filter3-5').checked = false
    document.getElementById('filter5-10').checked = false
    document.getElementById('filter10-20').checked = false
    document.getElementById('filter20+').checked = false

    document.getElementById('search-groups').value = ''
})

// group search search
document.getElementById('search-groups').addEventListener("input", () => {
    // erase every kind of space 
    const search_string = document.getElementById('search-groups').value.replace(/\s+/g, "");
    debounceSearch_navingation(search_string)
});

// open/close filters
document.querySelector('.search-box-filter').addEventListener("click", () => {
    document.getElementById('filter-dropdown').classList.toggle('hidden')
})

// filters update + search
document.getElementById('filter-dropdown').addEventListener('change', () => {
    groupSearchFilters.Imanage = document.getElementById('onlyMyGroups').checked

    groupSearchFilters.membersCount._3_5 = document.getElementById('filter3-5').checked
    groupSearchFilters.membersCount._5_10 = document.getElementById('filter5-10').checked
    groupSearchFilters.membersCount._10_20 = document.getElementById('filter10-20').checked
    groupSearchFilters.membersCount._20plus = document.getElementById('filter20+').checked

    groupSearchFilters.activityLevel = document.querySelector('input[name="activity"]:checked').value

    const search_string = document.getElementById('search-groups').value.replace(/\s+/g, "");
    debounceSearch_navingation(search_string)
})

// open/close search bar
document.getElementById('search-icon').addEventListener('click', ()=> {
    searchModel.classList.toggle('search-modal-collapsed')
    overlay.classList.toggle('hidden')

    if(overlay.classList.contains('hidden')) {
        document.getElementById('sidebar').style.zIndex = '3'
        searchModel.style.zIndex = '2'
    }

    else {
        document.getElementById('sidebar').style.zIndex = '5'
        searchModel.style.zIndex = '4'
    }
})

// click on overlay close modals
overlay.addEventListener('click', (event) => {
    if(!searchModel.classList.contains('search-modal-collapsed') && event.target != searchModel) 
    {
        searchModel.classList.add('search-modal-collapsed')

        searchModel.style.zIndex = '2'
        document.getElementById('sidebar').style.zIndex = '3'

        overlay.classList.add('hidden')
    }

    else if(!newMessageModal.classList.contains('hidden') && event.target != newMessageModal)
    {
        newMessageModal.classList.add('hidden')
        overlay.classList.add('hidden')
        overlay.classList.remove('darken')

        currentSelctedUsers = []
    }
})

// search modal
sidebarSearchInput.addEventListener('input', () => {
    if(sidebarSearchInput.value.length > 0) {
        document.getElementById('pre-search').classList.add('hidden')
        document.getElementById('post-search').classList.remove('hidden')
    }

    else {
        document.getElementById('post-search').classList.add('hidden')
        document.getElementById('pre-search').classList.remove('hidden')
    }
})

// search modal x-button
document.querySelector('#sidebar-search svg').addEventListener('click', () => {
    sidebarSearchInput.value = ''

    document.getElementById('post-search').classList.add('hidden')
    document.getElementById('pre-search').classList.remove('hidden')
})

// search modal search
document.getElementById('sidebar-search-input').addEventListener("input", () => {
    // erase every kind of space 
    const search_string = document.getElementById('sidebar-search-input').value.replace(/\s+/g, "");
    debounceSearch_searchModal(search_string)
});

// new message modal open
document.querySelector('#no-open-chat-poster button').addEventListener('click', async () => {
    newMessageModal.classList.add('NM-mode')
    newMessageModal.classList.add('AP-mode')
    newMessageModal.classList.remove('hidden')

    newMessageModal.querySelector('h3').innerText     = 'New message'
    newMessageModal.querySelector('button').innerText = 'Chat'

    overlay.classList.remove('hidden')
    overlay.classList.add('darken')

    debounceSearch_newMessageModal('')
})

// new message modal x-button
document.getElementById('new-message-x').addEventListener('click', () => {
    newMessageModal.classList.add('hidden')
    overlay.classList.add('hidden')
    overlay.classList.remove('darken')

    document.getElementById('new-message-search-input').value = ''
    currentSelctedUsers = []
})

// 1. new message modal - create/open chat
// 2. add people modal  - add
document.getElementById('new-message-button').addEventListener('click', async () => {
    if(newMessageModal.classList.contains('NM-mode')) {
        await createOrOpenChat(currentSelctedUsers)
    }   
    else {
        await addPeopleToGroup(document.getElementById('open-chat').dataset._id)

        // close details
        document.getElementById('open-chat-details').classList.add('hidden')
        document.getElementById('chat-details-icon').classList.remove('hidden')
        document.getElementById('chat-details-icon-fill').classList.add('hidden')
    }

        // close modal
        newMessageModal.classList.add('hidden')
        overlay.classList.add('hidden')
        overlay.classList.remove('darken')

        currentSelctedUsers = []

})

// new message modal search
document.getElementById('new-message-search-input').addEventListener("input", async () => {
    const search_string = document.getElementById('new-message-search-input').value.replace(/\s+/g, "");;
    debounceSearch_newMessageModal(search_string)
});

// notes animation
const speed = 25; // pixels per second
const containers = document.querySelectorAll('.song-name-wrapper');

containers.forEach(container => {
  const text = container.querySelector('span');
  
  if(container.offsetWidth > text.offsetWidth){

    container.style.width = text.offsetWidth + 'px'
    container.style.height = text.offsetHeight + 'px'
    container.style.display = 'flex'
    container.style.justifyContent = 'center'
    container.style.alignItems = 'center'

    container.classList.remove('song-name-wrapper')

    text.style.position = 'relative'
    return;
  }

  let pos = container.offsetWidth; // container's right side
  const textWidth = text.offsetWidth;

  function step() {
    pos -= speed / 60; // 60 fps approximation
    
    // if fully overflows - position gets initialized back to the right side of the container
    if (pos <= -textWidth) {
      pos = container.offsetWidth;
    }

    // actually move it
    text.style.transform = `translateX(${pos}px) translateY(-50%)`;
    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
});

// right notes scroll button
document.getElementById('scroll-notes-right').addEventListener('click', () => {
    const _2ndWrapper = document.getElementById('notes-2nd-wrapper')

    _2ndWrapper.scrollBy({
        left: 240,
        behavior: "smooth",
    })

    document.getElementById('scroll-notes-left').classList.remove('hidden')

    // if the button is in the end - hide it
    setTimeout(() => {
        if(_2ndWrapper.scrollLeft + _2ndWrapper.clientWidth >= _2ndWrapper.scrollWidth - 1) // to reduce error rate
        document.getElementById('scroll-notes-right').classList.add('hidden')
    }, 300)
})

// left notes scroll button
document.getElementById('scroll-notes-left').addEventListener('click', () => {
    const _2ndWrapper = document.getElementById('notes-2nd-wrapper')

    _2ndWrapper.scrollBy({
        left: -240,
        behavior: "smooth",
    })

    document.getElementById('scroll-notes-right').classList.remove('hidden')

    // if the button is in the start - hide it
    setTimeout(() => {
        if(_2ndWrapper.scrollLeft === 0)
        document.getElementById('scroll-notes-left').classList.add('hidden')
    }, 300)
})

// show send button when needed
document.getElementById('open-chat-message-input').addEventListener('input', ()=>{
    if(document.getElementById('open-chat-message-input').value.length > 0) {
        document.getElementById('open-chat-message-right-icons').classList.add('hidden')
        document.querySelector('#open-chat-message-box span').classList.remove('hidden')
    }

    else {
        document.getElementById('open-chat-message-right-icons').classList.remove('hidden')
        document.querySelector('#open-chat-message-box span').classList.add('hidden')
    }

    // resizing the textarea with a limit of 100px
    document.getElementById('open-chat-message-input').style.height = '50px'
    document.getElementById('open-chat-message-input').style.height = 
        Math.min(document.getElementById('open-chat-message-input').scrollHeight, 100) + 'px'

})

// open and close chat details
document.querySelectorAll('.chat-details-icon').forEach((icon) => {
    icon.addEventListener('click', () => {
        document.getElementById('open-chat-details').classList.toggle('hidden')
        document.getElementById('chat-details-icon').classList.toggle('hidden')
        document.getElementById('chat-details-icon-fill').classList.toggle('hidden')
    })
})

// render chat members to chat details
document.getElementById('chat-details-icon').addEventListener('click', async () => {
    const chatId   = document.getElementById('open-chat').dataset._id;
    const response = await fetch('/chats/findById', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            _id: chatId
        })
    })

    const chat = await response.json()
    if(chat.members.length <= 2) {
        const otherMember = chat.members.filter(m => m != AccountUsername)[0]
        document.querySelector('#members-wrapper ul').innerHTML = `
        <li>
            <div class="chat-member-pfp chat-pfp pfp">
                <img src="${await avatarOf(otherMember)}" alt="profile not found">
            </div>
            <div class="chat-description">
                <span class="chat-title">${otherMember}</span>
                <span class="chat-subtitle">${await fullnameOf(otherMember)}</span>
            </div>
        </li>
        `

        // change it from 'group' to 'chat'
        document.querySelector('#change-chat-name span').innerText = 'Change chat name'

        // no owner
        document.querySelector('#change-chat-name button').style.color = '#cecece'
        document.querySelector('#change-chat-name button').style.cursor = 'not-allowed'
        document.querySelector('#change-chat-name button').title = 'Cannot change a dialog name'
        document.querySelector('#change-chat-name button').disabled = true

        // dialog - does not allow adding people
        const addPeople = document.getElementById('open-chat-add-people')
        addPeople.classList.add('hidden')
    }

    else {
        let memberSettings = 'hidden'
        if(AccountUsername === chat.owner) 
            memberSettings = ''

        document.querySelector('#members-wrapper ul').innerHTML = `
        <li id="chat-member-me">
            <div class="chat-member-pfp chat-pfp pfp">
                <img src="${await avatarOf(AccountUsername)}" alt="Chat picture not found">
            </div>
            <div class="chat-description">
                <span class="chat-title">${AccountUsername}</span>
                <span class="chat-subtitle">${await fullnameOf(AccountUsername)}</span>
            </div>
        </li>        
        `

        if(AccountUsername === chat.owner) 
            document.querySelector('#chat-member-me .chat-subtitle').innerHTML = 'Admin &bull; ' + document.querySelector('#chat-member-me .chat-subtitle').innerText

        chat.members.filter(m => m != AccountUsername).forEach(async (member) => {
            const li = document.createElement('li')
            li.innerHTML = `
                <div class="chat-member-pfp chat-pfp pfp">
                    <img src="${await avatarOf(member)}" alt="profile not found">
                </div>
                <div class="chat-description">
                    <span class="chat-title">${member}</span>
                    <span class="chat-subtitle">${await fullnameOf(member)}</span>
                </div>
                <svg aria-label="Member settings" class="owner-privileges-member-settings ${memberSettings}" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Member settings</title><circle cx="12" cy="12" r="1.5"></circle><circle cx="12" cy="6" r="1.5"></circle><circle cx="12" cy="18" r="1.5"></circle></svg>
            `

            if(member === chat.owner) 
            li.querySelector('.chat-subtitle').innerHTML = 'Admin &bull; ' + li.querySelector('.chat-subtitle').innerText

            document.querySelector('#members-wrapper ul').appendChild(li)
        })

        // group - allow adding people
        document.getElementById('open-chat-add-people').classList.remove('hidden')
        document.querySelector('#change-chat-name span').innerText = 'Change group name'

        // owner privileges in group
        if(chat.owner === AccountUsername) { 
            document.querySelector('#change-chat-name button').style.cursor = 'pointer'
            document.querySelector('#change-chat-name button').style.color = '#000'
            document.querySelector('#change-chat-name button').title = ''
            document.querySelector('#change-chat-name button').disabled = false

            // change styling and title of add people
            const addPeople = document.getElementById('open-chat-add-people')
            addPeople.style.cursor = 'pointer'
            addPeople.style.color  = '#00f'

            if(!chat.name) {
                addPeople.disabled = true
                addPeople.title    = 'You cannot add people until the group has a name'
            }
            else {
                addPeople.disabled = false
                addPeople.title    = ''
            }
        }

        else {
            document.querySelector('#change-chat-name button').style.cursor = 'not-allowed'
            document.querySelector('#change-chat-name button').style.color  = '#cecece'
            document.querySelector('#change-chat-name button').title        = 'Only group owner can change group name'
            document.querySelector('#change-chat-name button').disabled     = true

            const addPeople = document.getElementById('open-chat-add-people')
            addPeople.style.cursor  = 'auto'
            addPeople.style.color   = '#7373b8'
            addPeople.disabled      = true
            addPeople.title         = 'Only group owner can add people'
        }
    }
})

// move and update mute slider
document.getElementById('mute-slider').addEventListener('click', ()=> {
    const slider = document.getElementById('mute-slider')
    slider.classList.toggle('on')
    slider.classList.toggle('off')

    // toggle
    document.getElementById('mute-chat-checkbox').checked = !document.getElementById('mute-chat-checkbox').checked
})

// open change group name modal 
document.querySelector('#change-chat-name button').addEventListener('click', () => {
    // modal
    changeGroupNameModal.classList.remove('hidden')
    overlay.classList.remove('hidden')
    overlay.classList.add('darken')

    // change group name input
    document.querySelector('#change-group-name-input input').value = document.getElementById('open-chat').dataset.name
    if(document.querySelector('#change-group-name-input input').value.length > 0) {    
        document.querySelector('#change-group-name-input label').classList.add('filled-input')
        document.querySelector('#change-group-name-input label').classList.remove('empty-input')
    }
})

// close change group name modal
document.getElementById('change-group-name-x').addEventListener('click', () => {
    changeGroupNameModal.classList.add('hidden')
    overlay.classList.add('hidden')
    overlay.classList.remove('darken')
})

// animate the "Group name" label
document.querySelector('#change-group-name-input input').addEventListener('input', async () => {
    const response =  await fetch('/chats/findById', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            _id: document.getElementById('open-chat').dataset._id
        })
    })

    const openChat = await response.json()
    const originalName = openChat.name

    

    if(document.querySelector('#change-group-name-input input').value.length > 0) {    
        document.querySelector('#change-group-name-input label').classList.add('filled-input')
        document.querySelector('#change-group-name-input label').classList.remove('empty-input')
    }

    else {
        document.querySelector('#change-group-name-input label').classList.add('empty-input')
        document.querySelector('#change-group-name-input label').classList.remove('filled-input')
    }

    if(document.querySelector('#change-group-name-input input').value != originalName) {
        document.querySelector('#change-group-name-save button').classList.add('unlocked')
        document.querySelector('#change-group-name-save button').classList.remove('locked')
    }


    else {
        document.querySelector('#change-group-name-save button').classList.add('locked')
        document.querySelector('#change-group-name-save button').classList.remove('unlocked')
    }
})

// update group name after save
document.querySelector('#change-group-name-save button').addEventListener('click', async () => {
    if(document.querySelector('#change-group-name-save button').classList.contains('locked'))
        return;

    const newName = document.querySelector('#change-group-name-input input').value
    await fetch('/chats/changeName', {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            new_name: newName,
            _id: document.getElementById('open-chat').dataset._id
        })
    })

    // close change group name modal
    changeGroupNameModal.classList.add('hidden')
    overlay.classList.add('hidden')
    overlay.classList.remove('darken')

    // update page
    document.getElementById('open-chat-title').innerText = newName
    document.querySelector('.chat.active .chat-title').innerText = newName

    // allow adding people
    document.getElementById('open-chat-add-people').disabled = false
    document.getElementById('open-chat-add-people').title    = ''
})

// add people open
document.getElementById('open-chat-add-people').addEventListener('click', (event) => {
    // if account is not the owner
    if(document.getElementById('open-chat-add-people').disabled)
        return;

    newMessageModal.classList.add('AP-mode')
    newMessageModal.classList.remove('NM-mode')
    newMessageModal.classList.remove('hidden')

    newMessageModal.querySelector('h3').innerText     = 'Add people'
    newMessageModal.querySelector('button').innerText = 'Add'

    overlay.classList.remove('hidden')
    overlay.classList.add('darken')

    debounceSearch_newMessageModal('', event.target)
})

// leave chat
document.querySelector('#open-chat-leave button').addEventListener('click', async () => {
    await fetch('/chats/removeMember', {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            _id: document.getElementById('open-chat').dataset._id,
            username: AccountUsername
        })
    })
    
    // close chat
    document.querySelector(`.chat[data-_id="${document.getElementById('open-chat').dataset._id}"]`).remove()
    document.getElementById('open-chat-wrapper').classList.add('hidden')
    document.getElementById('no-open-chat-poster').classList.remove('hidden')

})

// functions
async function groupchatHTML(ownerAvatar, viceownerAvatar, chatName, memebrsWithoutAccount, maxLetters=50) {
    chatName = chatName.length > 50 ? chatName.slice(0, maxLetters)+'...' : chatName
    return `
        <div class="chat-pfp group-chat-pfp">
            <img class="pfp group-chat-img1" src="${viceownerAvatar}" alt="not found">
            <img class="pfp group-chat-img2" src="${ownerAvatar}" alt="not found">
        </div>
        <div class="chat-description">
            <span class="chat-title">${chatName}</span>
            <span class="chat-subtitle">${await last_activation(memebrsWithoutAccount)}</span>
        </div>
        `
}

async function dialogchatHTML(otherAvatar, OtherUserame) {
    return `
        <div class="chat-pfp pfp">
            <img src="${otherAvatar}" alt="not found">
        </div>
        <div class="chat-description">
            <span class="chat-title">${OtherUserame}</span>
            <span class="chat-subtitle">${await last_activation(OtherUserame)}</span>
        </div>
        `
}

async function avatarOf(username) {
    const response = await fetch('/users/getAvatarByUsername', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            username: username
        })
    })
    const data = await response.json() 
    return data.avatar
}

async function fullnameOf(username) {
    const response = await fetch('/users/getFullnameByUsername', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            username: username
        })
    })
    const data = await response.json() 
    return data.fullname
}

let currentUsersController = null;
async function liveUsersSearch(searchString, eventTarget) {
    // if a former fetch is still running - shut it off
    if(currentUsersController)
        currentUsersController.abort()


    // signal to shut off fetchs which take too long
    currentUsersController = new AbortController()
    const signal = currentUsersController.signal
    try {
    const response = await fetch('/users/search', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            search_string: searchString
        }),
        signal: signal
    })
    let searchResultData  = await response.json()

    // dont show chat members when trying to add people
    if(eventTarget === document.getElementById('open-chat-add-people')) {
        const chatRespose = await fetch('/chats/findById', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                _id: document.getElementById('open-chat').dataset._id
            })
        }) 
        const chat = await chatRespose.json()

        searchResultData = searchResultData.filter(res => !chat.members.includes(res))
    }

    return searchResultData.filter(res => res.username != AccountUsername).slice(0, 20)
    }

    catch(err) {
        // if we caught an abort - its ok we sent it
        if(err.name ==="AbortError") return 
        console.error("Live Search Failed:", err)
    }
}

let currentGroupsController = null
async function liveGroupsSearch(searchString) {
    // if a former fetch is still running - shut it off
    if(currentGroupsController)
        currentGroupsController.abort()


    // signal to shut off fetchs which take too long
    currentGroupsController = new AbortController()
    const signal = currentGroupsController.signal
    try {
    const response = await fetch('/chats/search', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            search_string: searchString
        }),
        signal: signal
    })


    let searchResultData  = await response.json()

    //filters
    if(groupSearchFilters.Imanage) {
        searchResultData = searchResultData.filter(res => res.owner === AccountUsername)
    }

    if(groupSearchFilters.membersCount._3_5 || groupSearchFilters.membersCount._5_10 ||
     groupSearchFilters.membersCount._10_20 || groupSearchFilters.membersCount._20plus) {
        if(!groupSearchFilters.membersCount._3_5)
            searchResultData = searchResultData.filter(res => !(res.members.length <= 5))

        if(!groupSearchFilters.membersCount._5_10)
            searchResultData = searchResultData.filter(res => !(res.members.length > 5 && res.members.length <= 10))

        if(!groupSearchFilters.membersCount._10_20)
            searchResultData = searchResultData.filter(res => !(res.members.length > 10 && res.members.length <= 20))

        if(!groupSearchFilters.membersCount._20plus)
            searchResultData = searchResultData.filter(res => !(res.members.length >= 20))
    }


    let activityPercentageRange = [100, 0]
    switch(groupSearchFilters.activityLevel) {
        case 'any': activityPercentageRange    = [1.0, 0.0]; break;
        case 'high': activityPercentageRange   = [1.0, 0.75]; break;
        case 'medium': activityPercentageRange = [0.75, 0.25]; break;
        case 'low': activityPercentageRange    = [0.25, 0.0]; break;
    }

    let finalsearchResultData = []
    const promises = searchResultData.map(res => {
        return new Promise(async (resolve, reject) => {
            try {
                const lastActivation = await last_activation(res.members)
                const seenToday = parseInt(lastActivation.replace(/\D/g, ""))
                const activityPercentage = seenToday / res.members.length
                if(activityPercentage <= activityPercentageRange[0] && activityPercentage >= activityPercentageRange[1])
                    finalsearchResultData.push(res)

                // ends promise
                resolve()
            }
            catch(err) {
                reject(err)
            }
        })
    })

    // all promises are done
    await Promise.all(promises)
    return finalsearchResultData
    }

    catch(err) {
        // if we caught an abort - its ok we sent it
        if(err.name ==="AbortError") return 
        console.error("Live Search Failed:", err)
    }
}

async function uploadSearchResults_NewMessageModal(searchString, eventTarget=null) {
    const searchResultData = await liveUsersSearch(searchString, eventTarget)

    let resultsContainer = document.querySelector('#new-message-results ul')
    resultsContainer.innerHTML = ``

    // render to HTML
    searchResultData.forEach(async (result) => {
        // if its add people mode and this username is already in group - don't show it
        const li = document.createElement('li') 
        li.dataset.username = result.username
            li.innerHTML = `
            <div class="new-message-pfp chat-pfp pfp">
                <img src="${await avatarOf(result.username)}" alt="not-found">
                </div>
            <div class="chat-description">
                <span class="chat-title">${result.username}</span>
                <span class="chat-subtitle">${await fullnameOf(result.username)}</span>
            </div>
        `

        resultsContainer.appendChild(li) 
        
        // event listeners to select accounts in new message modal
        li.addEventListener('click', () => {
            li.classList.toggle('selected')

            // add selected username to currentChatMembers or remove it if its already there
            const selectedUsername = li.dataset.username
            if(currentSelctedUsers.includes(selectedUsername))
                currentSelctedUsers.splice(currentSelctedUsers.indexOf(selectedUsername), 1)

            else
                currentSelctedUsers.push(selectedUsername)

            // locking and unlocking the button
            if(currentSelctedUsers.length > 0)
                document.getElementById('new-message-button').classList.add('unlock')

            else
                document.getElementById('new-message-button').classList.remove('unlock')
        })

        // if selected
        if(currentSelctedUsers.indexOf(result.username) !== -1) {
            li.classList.add('selected')
        }
    })
}

async function uploadSearchResults_searchModal(searchString) {
    const searchResultData = await liveUsersSearch(searchString)

    let resultsContainer = document.querySelector('#post-search ul')
    resultsContainer.innerHTML = ``
    // render to HTML
    searchResultData.forEach(async (result) => {
        const li = document.createElement('li') 
        li.dataset.username = result.username
            li.innerHTML = `
            <div class="pfp search-result-account-pfp">
                <img src="${await avatarOf(result.username)}" alt="not found">
            </div>
            <div class="search-result-account-description">
                <div class="search-result-account-username">${result.username}</div>
                <div class="search-result-account-fullname">${await fullnameOf(result.username)}</div>
            </div>
        `

        resultsContainer.appendChild(li) 
        
        // event listeners to select accounts in new message modal
        li.addEventListener('click', async () => {
            await createOrOpenChat([li.dataset.username])

            // close modal
            searchModel.classList.add('search-modal-collapsed')
            searchModel.style.zIndex = '0'
            document.getElementById('sidebar').style.zIndex = '1'
            overlay.classList.add('hidden') 
        })
    })
}

async function uploadSearchResults_navigation(searchString) {
    const searchResultData = await liveGroupsSearch(searchString)
    let resultsContainer = document.querySelector('#chats-search-results-wrapper ul')
    resultsContainer.innerHTML = ``
    // render to HTML
    searchResultData.forEach(async (result) => {
        const GroupClass = result.members.includes(AccountUsername) ? 'opened-group' : 'join-group'
        const button = (GroupClass === 'opened-group')  ? '' : `<button>Join</button>`

        const li = document.createElement('li') 
        li.classList.add(GroupClass)
        li.dataset._id = result._id

        li.innerHTML = await groupchatHTML(await avatarOf(result.owner), await avatarOf(result.viceowner),
            result.name || result.members.join(', '), result.members, 25) + button
        

        resultsContainer.appendChild(li) 
        
        
        // event listeners to select groups to join
        li.addEventListener('click', async () => {
            let chatDiv;

            // join and add chat to HTML
            if(li.classList.contains('join-group')) {
                // join
                addToGroup(result._id, AccountUsername)

                // HTML
                chatDiv = document.createElement('div')
                chatDiv.classList.add('chat', 'group-chat')
                chatDiv.dataset._id = result._id

                const resultName = result.name || result.members.filter(m => m != AccountUsername).join(', ')

                chatDiv.innerHTML = await groupchatHTML(await avatarOf(result.owner), await avatarOf(result.viceowner), resultName, result.members.filter(m => m != AccountUsername))

                // pushes at the top of the element
                document.getElementById('scroller').prepend(chatDiv)
                chatDiv.addEventListener('click', () => {
                    openChat(chatDiv, result) 
                })
            }

            // find chat at the HTML
            else {
                document.querySelectorAll('.chat.group-chat').forEach(chat => {
                    if(chat.dataset._id === result._id)
                        chatDiv = chat
                })
            }

            // close group search
            document.getElementById('chats-search-results-wrapper').classList.add('hidden')
            document.getElementById('chats-wrapper').classList.remove('hidden')

            document.querySelector('.search-box-magniglass').classList.remove('hidden')
            document.querySelector('.search-box-arrow').classList.add('hidden')
            document.querySelector('.search-box-filter').classList.add('hidden')
            document.getElementById('search-groups').classList.remove('searching')

            document.getElementById('search-groups').value = ''

            // open selected group
            openChat(chatDiv, result)
        })
    })
}

// to ease the search for the server - send the last req 0.4s after the user stop typing
function debounce(fn, delay_MS) {
    let timer;

    // return f with some arguments, every time debounce gets called - clear timer
    // if debounce doesn't get called in delay_MS milisecends fn will be called
    return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => fn(...args), delay_MS)
    }
}

async function last_activation(members) {
    if(typeof members === "string") {
        const response = await fetch('/users/getLastseenByUsername', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: members
            })
        })

        const {date} = await response.json()
        return shortDateFormat(date)
    }

    else {
        const {nows, todays} = await countNowsAndTodays(members)
        
        if(nows > 0)
            return nows + ' active now'

        else if(todays > 0)
            return todays + ' active today'

        else 
            return 'None active today'
    }
}

function shortDateFormat(date) {
    const diff_S = Math.floor((new Date() - new Date(date)) / 1000)
    
    if(diff_S < 10)
        return 'Active now'

    if(diff_S < 60)
        return 'Active ' + Math.floor(diff_S) + 's ago'

    if(diff_S < 60 * 60)
        return 'Active ' + Math.floor(diff_S/60) + 'min ago'

    if(diff_S < 60 * 60 * 24)
        return 'Active ' + Math.floor(diff_S/(60*60)) + 'h ago'

    if(diff_S < 60 * 60 * 24 * 7)
        return 'Active ' + Math.floor(diff_S/(60*60*24)) + ' days ago'

    if(diff_S < 60 * 60 * 24 * 30)
        return 'Active ' + Math.floor(diff_S/(60*60*24)) + ' weeks ago'

    if(diff_S < 60 * 60 * 24 * 30 * 12)
        return 'Active ' + Math.floor(diff_S/(60*60*24*30)) + ' months ago'

    else
        return 'Active ' + Math.floor(diff_S/(60*60*24*30*12)) + ' years ago'

    
}

async function countNowsAndTodays(members) {
    let todays = 0, nows = 0
    await Promise.all(members.map( async (member) => {
            const response = await fetch('/users/getLastseenByUsername', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    username: member
                })
            })

            const {date} = await response.json()

            let shortdate = shortDateFormat(date)
            if(shortdate.endsWith('now'))
                ++nows

            // added a check if its secends and the before the s is a digit
            else if(( /\d/.test(shortdate.at(-6)) && shortdate.endsWith('s ago')) || shortdate.endsWith('min ago') || shortdate.endsWith('h ago'))
                ++todays 
        }))
    return {nows, todays}
}

async function renderChat(chatDiv, chat) {

    const chatName = chat.name || chat.members.filter(m => m != AccountUsername).join(', ')
    document.getElementById('open-chat-title').innerText = chatName.length > 50 ? chatName.slice(0, 60)+'...' : chatName
    document.getElementById('open-chat-subtitle').innerText = chat.members.length > 2 
        ? await last_activation(chat.members)
        : await last_activation(chat.members.filter(m => m != AccountUsername)[0])


    if(chatDiv.classList.contains('group-chat')) {
        document.getElementById('open-chat-pfp').innerHTML   =   `
            <img class="pfp group-chat-img1" src="${await avatarOf(chat.viceowner)}" alt="not found">
            <img class="pfp group-chat-img2" src="${await avatarOf(chat.owner)}" alt="not found">
        `

        document.getElementById('open-chat-pfp').classList.remove('pfp')
        document.getElementById('open-chat-pfp').classList.add('group-chat-pfp')
    }

    else {
        document.getElementById('open-chat-pfp').innerHTML   =  `
            <img src="${await avatarOf(chat.members.filter(m => m != AccountUsername)[0])}" alt="not found">
        `
        document.getElementById('open-chat-pfp').classList.remove('group-chat-pfp')
        document.getElementById('open-chat-pfp').classList.add('pfp')
    }
}

async function openChat(chatDiv, chat) {
        chatDiv.classList.add('active')
        document.getElementById('open-chat').dataset._id = chat._id
        document.getElementById('open-chat').dataset.name = chat.name

        // unactivate all active chats 
        document.querySelectorAll('.chat.active').forEach((otherChatDiv) => {
            if(otherChatDiv !== chatDiv)
            otherChatDiv.classList.remove('active')
        })

        // open the chat
        document.getElementById('no-open-chat-poster').classList.add('hidden')
        document.getElementById('open-chat-wrapper').classList.remove('hidden')

        // remove details and details icon
        document.getElementById('open-chat-details').classList.add('hidden')
        document.getElementById('chat-details-icon').classList.remove('hidden')
        document.getElementById('chat-details-icon-fill').classList.add('hidden')

        await renderChat(chatDiv, chat)
}

async function createOrOpenChat(members) {
    const response = await fetch('/chats/createIfNotExists', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            name: '',
            owner: AccountUsername,
            viceowner: members[0],
            members: [AccountUsername, ...members]
        })
    })
    const newChatData = await response.json()
    const chat = newChatData.chat

    if(!newChatData.found) {
        const owner = chat.owner, viceowner = chat.viceowner 
        const chatName = chat.name || members.join(', ')

        // is group (members without this account)
        if(members.length >= 2) {
            const chatDiv = document.createElement('div')
            chatDiv.classList.add('chat', 'group-chat')

            chatDiv.innerHTML = await groupchatHTML(await avatarOf(owner), await avatarOf(viceowner), chatName, members)
            // pushes at the top of the element
            document.getElementById('scroller').prepend(chatDiv)
            chatDiv.addEventListener('click', () => {
                openChat(chatDiv, chat) 
            })

            chatDiv.dataset._id = chat._id
            openChat(chatDiv, chat)
        }

        else {
            const chatDiv = document.createElement('div')
            chatDiv.classList.add('chat')

            chatDiv.innerHTML = await dialogchatHTML(await avatarOf(viceowner), viceowner)
            // pushes at the top of the element
            document.getElementById('scroller').prepend(chatDiv)
            chatDiv.addEventListener('click', () => {
                openChat(chatDiv, chat)
            })

            chatDiv.dataset._id = chat._id
            openChat(chatDiv, chat)
        }
    }

    else {
        document.querySelectorAll('.chat').forEach(chatDiv => {
            if(chatDiv.dataset._id === chat._id){
                openChat(chatDiv, chat)
            }
        })
    }
}

async function addToGroup(chatId, username) {
    const response = await fetch('/chats/addMember', {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            _id: chatId,
            username: username
        })
    })

    return await response.json()
}

async function addPeopleToGroup(groupId) {
    currentSelctedUsers.forEach(async (selectedUser) => {
        addToGroup(groupId, selectedUser)
    })
}


