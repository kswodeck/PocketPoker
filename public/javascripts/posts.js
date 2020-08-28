var documentIsReady = new Promise(resolve => {
  document.onreadystatechange = function () {
    if (document.readyState == "complete") {
      resolve(5);
    }
  };
});

var postTitle = document.getElementById('postTitle');
var postTextArea = document.getElementById('editor-container');
if (document.getElementsByTagName('title')[0].innerText != 'Create New Post') {
  var editPostButton = document.getElementById('editPostButton');
  var postTextVal; //.value
  var postTitleVal;
  documentIsReady.then(() => {
    setTimeout(() => {
      postTitleVal = postTitle.value;
      postTextVal = postTextArea.innerText;
      editPostButton.disabled = true;
    }, 500);
  })
}

function renderTextHtml(htmlText, parentEl, user='false', sameCommenter='NA') {
  documentIsReady.then(() => {
    let el = parentEl;
    if (sameCommenter == 'NA' && user == 'true') {
      el = el.childNodes[0];
    }
    el.innerHTML = htmlText;
    el.innerHTML = el.innerText;
  }).then(() => {
    handleContent(null, parentEl, user, parentEl);
  });
}
  
function enablePostEdit(user='false', elId='editor-container') {
  let editorId = '#' + elId;
  let editor = document.querySelector(editorId);
  let placeholdText = 'type your comment here...';
  var form = editor.parentNode;
  var textInput = document.getElementById('commentTextInput' + elId.slice(15)); //uses the comment number from id
  if (editor.id.includes('addComment')) {
    textInput = document.getElementById('addCommentTextInput');
  }
  if (!editor.className.includes('Comment')) {
    textInput = document.getElementById('textInput');
    placeholdText = 'type your post content here...';
    form = form.parentNode;
    if (document.getElementsByTagName('title')[0].innerText != 'Create New Post')
    postTitle.disabled = false;
  }
  if (user !='false') {
      new Quill(editorId, {
        modules: {
          toolbar: [
            [{header: [2, 3, 4, false]}],
            ['bold', 'italic', 'underline', 'strike', {'script': 'sub'}, {'script': 'super'}, {'color': []}, {'background': []}, 'link'],
            [{'align': []}, { 'indent': '+1'}, {list: 'ordered'}, {list: 'bullet'}, 'blockquote']
          ]
        },
        placeholder: placeholdText,
        theme: 'snow'
      });
      documentIsReady.then(() => {
        form.onsubmit = function() { // Populate hidden form on submit
          textInput.value = editor.childNodes[0].innerHTML;
        };
      });
  }
}

function handleContent(evt=null, el=postTextArea, user='false', input1=postTextArea, input2=postTitle) {
  let theEvent = evt || window.event;
  setTimeout(() => {
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
    el.blur();
    if (evt && theEvent.code != 'Tab') {
      el.focus();
    }
    if (user != 'new' && user != 'false') { //these are not working well, staying disabled on posttextarea
      if ((postTextVal == input1.innerText && postTitleVal == input2.value) ||
        (document.querySelector('#editor-container > div.ql-editor').innerText.length < 10 || !input2.value)) {
        editPostButton.disabled = true;
      } else if ((postTextVal != input1.innerText && ((!!input2.value) && postTitleVal != input2.value)) &&
      document.querySelector('#editor-container > div.ql-editor').innerText.length > 9) {
        editPostButton.disabled = false;
      }
      console.log(postTextVal);
      console.log(input1.innerText);
      console.log(postTitleVal);
      console.log(input2.value);
      console.log(document.querySelector('#editor-container > div.ql-editor').innerText.length);
    }
  }, 100);
}

window.enablePostEdit = enablePostEdit; window.handleContent = handleContent;
window.renderTextHtml = renderTextHtml;

export * from './posts.js';