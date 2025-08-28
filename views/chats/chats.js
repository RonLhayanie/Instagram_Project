// constants
const searchModel          = document.getElementById('search-modal')
const overlay              = document.getElementById('overlay')
const sidebarSearchInput   = document.getElementById('sidebar-search-input')
const newMessageModal      = document.getElementById('new-message-modal')
const changeGroupNameModal = document.getElementById('change-group-name-modal')

const currentChatMembers   = []
const AccountUsername      = localStorage.getItem('username')
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

    chats.forEach(chat => {

        // owner and viceowner avatars fetch
        const ownerAvatar = avatarOf(AccountUsername)
        const viceownerAvatar = avatarOf(chat.viceowner)

        // is group
        if(chat.members.length > 2) {
            const chatDiv = document.createElement('div')
            chatDiv.classList.add('chat', 'group-chat')
            chatDiv.innerHTML = groupchatHTML(viceownerAvatar, ownerAvatar, chat.name, chat.members)

            document.getElementById('scroller').appendChild(chatDiv)
        }

        // is dialog
        else {
            const chatDiv = document.createElement('div')
            chatDiv.classList.add('chat')
            chatDiv.innerHTML = dialogchatHTML(viceownerAvatar, ownerAvatar, chat.viceowner)

            document.getElementById('scroller').appendChild(chatDiv)
        }
    })
})

// load account personal details
document.addEventListener('DOMContentLoaded', async () => {
    const avatar = await avatarOf(AccountUsername)
    document.querySelector('#my-note img').src = avatar
    document.querySelector('#profile img').src = avatar

    document.querySelector('#username p').innerText = AccountUsername
})

// redirections
const redirectionsIDs = ['home', 'instagram-logo']
redirectionsIDs.forEach(elID => {
    document.getElementById(elID).addEventListener('click', () => {
        window.location.href = '../feed/feed.html'
    })
})

// open/close search bar
document.getElementById('search-icon').addEventListener('click', ()=> {
    searchModel.classList.toggle('search-modal-collapsed')
    overlay.classList.toggle('hidden')

    document.getElementById('sidebar').style.zIndex = '5'
    searchModel.style.zIndex = '4'
})

// click on overlay close modals
overlay.addEventListener('click', (event) => {
    if(!searchModel.classList.contains('search-modal-collapsed') && event.target != searchModel) 
    {
        searchModel.classList.add('search-modal-collapsed')

        searchModel.style.zIndex = '0'
        document.getElementById('sidebar').style.zIndex = '1'

        overlay.classList.add('hidden')
    }

    else if(!newMessageModal.classList.contains('hidden') && event.target != newMessageModal)
    {
        newMessageModal.classList.add('hidden')
        overlay.classList.add('hidden')
        overlay.classList.remove('darken')

        currentChatMembers = []
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

// open new message modal
document.querySelector('#no-open-chat-poster button').addEventListener('click', async () => {
    newMessageModal.classList.remove('hidden')
    overlay.classList.remove('hidden')
    overlay.classList.add('darken')

    uploadSearchResults_NewMessageModal('')
})

// new message modal x-button
document.getElementById('new-message-x').addEventListener('click', () => {
    newMessageModal.classList.add('hidden')
    overlay.classList.add('hidden')
    overlay.classList.remove('darken')
})

// new message modal - create/open chat
document.getElementById('new-message-button').addEventListener('click', async () => {
    const groupName = currentChatMembers.join(', ')

    const response = await fetch('/chats/createIfNotExists', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            name: groupName,
            owner: AccountUsername,
            viceowner: currentChatMembers[0],
            members: currentChatMembers + AccountUsername,
        })
    })

    const newChatData = await response.json()

    if(newChatData.found) {
        //openChat
    }

    const owner = chat.owner, viceowner = chat.viceowner 
    const ChatName = chat.name

    const membersWithoutAccout = chat.members.filter(memberUsername => memberUsername != Account.username)

    // is group
    if(currentChatMembers.length > 2) {
        const chatDiv = document.createElement('div')
        chatDiv.classList.add('chat', 'group-chat')

        chatDiv.innerHTML = `
        <div class="chat-pfp group-chat-pfp">
            <img class="pfp group-chat-img1" src="${avatarOf(viceowner)}" alt="not found">
            <img class="pfp group-chat-img2" src="${avatarOf(owner)}" alt="not found">
        </div>
        <div class="chat-description">
            <span class="chat-title">${ChatName}</span>
            <span class="chat-subtitle">${last_activation(membersWithoutAccout)}</span>
        </div>
        `
        // pushes at the top of the element
        document.getElementById('scroller').prepend(chatDiv)
    }

    else {
        const chatDiv = document.createElement('div')
        chatDiv.classList.add('chat')

        chatDiv.innerHTML = `
        <div class="chat-pfp pfp">
            <img src="${avatarOf(chat.owner)}" alt="not found">
        </div>
        <div class="chat-description">
            <span class="chat-title">${membersWithoutAccout[0]}</span>
            <span class="chat-subtitle">${last_activation(membersWithoutAccout)}</span>
        </div>
        `
        // pushes at the top of the element
        document.getElementById('scroller').prepend(chatDiv)
    }
})

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

// chats
document.querySelectorAll('.chat').forEach((chat) => {
    chat.addEventListener('click', () => {
        chat.classList.add('active')

        // unactivate all active chats 
        document.querySelectorAll('.chat.active').forEach((otherChat) => {
            if(otherChat !== chat)
            otherChat.classList.remove('active')
        })

        // open the chat
        document.getElementById('no-open-chat-poster').classList.add('hidden')
        document.getElementById('open-chat-wrapper').classList.remove('hidden')

        // remove details and details icon
        document.getElementById('open-chat-details').classList.add('hidden')
        document.getElementById('chat-details-icon').classList.remove('hidden')
        document.getElementById('chat-details-icon-fill').classList.add('hidden')

        renderChat(chat)
        
    })
})

// fill all the fields
function renderChat(chat) {
    
}

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

// move and update mute slider
document.getElementById('mute-slider').addEventListener('click', ()=> {
    const slider = document.getElementById('mute-slider')
    slider.classList.toggle('on')
    slider.classList.toggle('off')

    // toggle
    document.getElementById('mute-chat-checkbox').checked = !document.getElementById('mute-chat-checkbox').checked
})

// chat owner privileges
document.querySelectorAll('#new-message-results ul li').forEach(async (chatDiv) =>  {
    const response = await fetch('/chats/isOwner', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            id: chatDiv.dataset.data_id,
            username: AccountUsername
        })
    })

    const { isOwner } = await response.json()

    if(isOwner) { 
        const addPeople = document.getElementById('open-chat-add-people')

        // change styling and title
        addPeople.style.color  = 'blue'
        addPeople.style.cursor = 'pointer'
        addPeople.title = ''

        document.querySelector('#change-chat-name button').title = ''
        document.querySelector('#change-chat-name button').disabled = false

        // add member settings button to all members
        document.querySelectorAll('.owner-privileges-member-settings').forEach((memberSettings) => {
            memberSettings.classList.remove('hidden')
        })
    }
});

// change group name modal open 
document.querySelector('#change-chat-name button').addEventListener('click', () => {
    changeGroupNameModal.classList.remove('hidden')
    overlay.classList.remove('hidden')
    overlay.classList.add('darken')
})

// remove change group name modal
document.getElementById('change-group-name-x').addEventListener('click', () => {
    changeGroupNameModal.classList.add('hidden')
    overlay.classList.add('hidden')
    overlay.classList.remove('darken')
})

// animate the "Group name" label
document.querySelector('#change-group-name-input input').addEventListener('input', async () => {
    const originalName = ' no name UI ' /*Response =  await fetch('/chats/findNameById', {
        method: 'POST',
        headers: {'ContentType': 'application/json'},
        body: JSON.stringify({
            id: document.getElementById('open-chat').dataset.getAttribute('data-_id')
        })
    })

    const originalName = await originalNameResponse.json()*/

    if(document.querySelector('#change-group-name-input input').value !== originalName) {    
        document.querySelector('#change-group-name-input label').classList.add('filled-input')
        document.querySelector('#change-group-name-input label').classList.remove('empty-input')

        document.querySelector('#change-group-name-save button').classList.add('unlocked')
        document.querySelector('#change-group-name-save button').classList.remove('locked')
    }

    else {
        document.querySelector('#change-group-name-input label').classList.add('empty-input')
        document.querySelector('#change-group-name-input label').classList.remove('filled-input')

        document.querySelector('#change-group-name-save button').classList.add('locked')
        document.querySelector('#change-group-name-save button').classList.remove('unlocked')
    }
})

// functions
function groupchatHTML(ownerAvatar, viceownerAvatar, chatName, currentChatMembers) {
    return `
        <div class="chat-pfp group-chat-pfp">
            <img class="pfp group-chat-img1" src="${viceownerAvatar}" alt="not found">
            <img class="pfp group-chat-img2" src="${ownerAvatar}" alt="not found">
        </div>
        <div class="chat-description">
            <span class="chat-title">${chatName}</span>
            <span class="chat-subtitle">${last_activation(currentChatMembers)}</span>
        </div>
        `
}

function dialogchatHTML(otherAvatar, OtherUserame) {
    return `
        <div class="chat-pfp pfp">
            <img src="${otherAvatar}" alt="not found">
        </div>
        <div class="chat-description">
            <span class="chat-title">${OtherUserame}</span>
            <span class="chat-subtitle">${last_activation(OtherUserame)}</span>
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

async function uploadSearchResults_NewMessageModal(searchString) {
    const response = await fetch('/users/search20', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            search_string: searchString
        })
    })

    let searchResultData  = await response.json()
    searchResultData = searchResultData.filter(res => res.username != AccountUsername)

    let resultsContainer = document.querySelector('#new-message-results ul')
    resultsContainer.innerHTML = ``

    // render to HTML
    searchResultData.forEach(async (result) => {
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
            if(currentChatMembers.includes(selectedUsername))
                currentChatMembers.splice(currentChatMembers.indexOf(selectedUsername), 1)

            else
                currentChatMembers.push(selectedUsername)

            // locking and unlocking the button
            if(currentChatMembers.length > 0)
                document.getElementById('new-message-button').classList.add('unlock')

            else
                document.getElementById('new-message-button').classList.remove('unlock')
        })
    })

}

async function last_activation(members) {
    if(members.length > 1) {
        const response = await fetch('/users/getLastseenByUsername', {
            mothod: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: members[0].username
            })
        })

        const date = await response.json()
        return shortDateFormat(date)
    }

    else {
        let dates = []
        members.forEach( async (member) => {
            const response = await fetch('/users/getLastseenByUsername', {
                mothod: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    username: member.username
                })
            })

            const date = await response.json()
            dates.push(date)
        })

        let nows = 0, todays = 0
        dates.forEach(date => { 
            date = shortDateFormat(date)
            if(date.endsWith('now'))
                nows += 1

            else if(date.endsWith('s ago') || date.endsWith('min ago') || date.endsWith('h ago'))
                todays += 1
        })

        if(nows > 0)
            return nows + ' active now'

        else if(todays > 0)
            return todays + ' active today'

        else 
            return 'None active today'
    }
}

function shortDateFormat(date) {
    const diff_S = Math.floor((new Date - date) * 1000)
    
    if(diff_S < 1)
        return 'Active now'

    if(diff_S < 60)
        return 'Active ' + diff_S + 's ago'

    if(diff_S < 60 * 60)
        return 'Active ' + diff_S + 'min ago'

    if(diff_S < 60 * 60 * 24)
        return 'Active ' + diff_S + 'h ago'

    if(diff_S < 60 * 60 * 24 * 7)
        return 'Active ' + diff_S +'days ago'

    if(diff_S < 60 * 60 * 24 * 30)
        return 'Active ' + diff_S + 'weeks ago'

    if(diff_S < 60 * 60 * 24 * 30 * 12)
        return 'Active ' + diff_S + 'months ago'

    else
        return 'Active ' + diff_S + 'years ago'
}