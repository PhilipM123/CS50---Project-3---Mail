document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  //Code added by Philip: After submitting the email, the contents of the email are posted to the server
  document.querySelector('#compose-form').onsubmit = function(e){
    e.preventDefault();
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients: document.querySelector('#compose-recipients').value,
          subject: document.querySelector('#compose-subject').value,
          body: document.querySelector('#compose-body').value,
          read: false
      })
    })
    .then(response => response.json())
    .then(result => {
        // Print result
        console.log(result);
    });
    load_mailbox('sent');
  };
  // By default, load the inbox
  load_mailbox('inbox');
}); 

function compose_email(reply, sender, subject, body, timestamp) {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#single-email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  // Reply button
  if(reply === "reply"){
    document.querySelector('#compose-recipients').value = sender;
    if(subject.charAt(0)+subject.charAt(1) === "Re"){
      console.log('pilpo is coming');
      document.querySelector('#compose-subject').value = `${subject}`;
    } else{document.querySelector('#compose-subject').value = `Re: ${subject}`;};
    document.querySelector('#compose-body').value = `On ${timestamp}, ${sender} wrote: ${body}`;
  };



}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#single-email-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  //Code added by Philip: Fetch the emails for the specific mailbox, get the latest 3 emails, view the email when clicked on
  fetch("/emails/"+mailbox)
  .then(response => response.json())
  .then(emails => {
    if(emails.length === 0){
      var div = document.createElement('div');
      div.innerHTML = `${"Mailbox is empty"}`;
      document.querySelector('#emails-view').appendChild(div);
    }else{

      const email1 = emails[0];
      const email2 = emails[1];
      const email3 = emails[2];
      
      var div1 = document.createElement("div");
      div1.style.border = `1px solid black`;
      div1.setAttribute("id", "div1");
      if(email1.read = false){div1.style.background = "white"}else{div1.style.background = "grey"};
      div1.style.borderColor = "black";
      div1.innerHTML = `${"Recipient: "+ email1.recipients + " //      " + "Subject: " + email1.subject + " //      "+ "Time: " + email1.timestamp}`;
      document.querySelector('#emails-view').appendChild(div1);
      div1.addEventListener('click', function(){
        const mailboxconst1 = mailbox;
        load_email(email1, mailboxconst1);
        
        fetch(`/emails/${email1.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            read: true
        })}).then(r => r.json()).then(d => console.log(d))
      });
  
      var div2 = document.createElement("div");
      div2.style.border = `1px solid black`;
      div2.setAttribute("id", "div2");
      if(email2.read = false){div2.style.background = "white"}else{div2.style.background = "grey"};
      div2.style.borderColor = "black";
      div2.innerHTML = `${"Recipient: "+ email2.recipients + " //      " + "Subject: " + email2.subject + " //      "+ "Time: " + email2.timestamp}`;
      document.querySelector('#emails-view').appendChild(div2);
      div2.addEventListener('click', function(){
        const mailboxconst2 = mailbox;
        load_email(email2, mailboxconst2);

        fetch(`/emails/${email2.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            read: true
        })}).then(r => r.json()).then(d => console.log(d))
      });
  
      var div3 = document.createElement("div");
      div3.style.border = `1px solid black`;
      div3.setAttribute("id", "div3");
      if(email3.read = false){div3.style.background = "white"}else{div3.style.background = "grey"};
      div3.style.borderColor = "black";
      div3.innerHTML = `${"Recipient: "+ email3.recipients + " //      " + "Subject: " + email3.subject + " //      "+ "Time: " + email3.timestamp}`;
      document.querySelector('#emails-view').appendChild(div3);
      div3.addEventListener('click', function(){
        const mailboxconst3 = mailbox;
        load_email(email3, mailboxconst3);

        fetch(`/emails/${email3.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            read: true
        })}).then(r => r.json()).then(d => console.log(d))
      });
      
    };

  })
  .catch(error => console.log(error));

  
  
}

//Philip's code: View Email function
function load_email(emailsingle, mailbox){
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#single-email-view').style.display = 'block';

  document.querySelector('#single-email-view').innerHTML = `<h3>${"Email"}</h3>`;

  var textsender = document.createElement("div");
  textsender.innerHTML = `${"From: "+emailsingle.sender}`;
  document.querySelector('#single-email-view').appendChild(textsender);

  var textrecipients = document.createElement("div");
  textrecipients.innerHTML = `${"To: "+emailsingle.recipients}`;
  document.querySelector('#single-email-view').appendChild(textrecipients);

  var textsubject = document.createElement('div');
  textsubject.innerHTML = `${"Subject: " + emailsingle.subject}`;
  document.querySelector('#single-email-view').appendChild(textsubject);

  var textbody = document.createElement('div');
  textbody.innerHTML = `${ emailsingle.body}`;
  document.querySelector('#single-email-view').appendChild(textbody);

  var texttimestamp = document.createElement('div');
  texttimestamp.innerHTML = `${"Timestamp: " + emailsingle.timestamp}`;
  document.querySelector('#single-email-view').appendChild(texttimestamp);

  var replybutton = document.createElement("button");
    replybutton.textContent = "Reply";
    document.querySelector('#single-email-view').appendChild(replybutton);
    replybutton.addEventListener('click', function(){
      compose_email("reply", emailsingle.sender, emailsingle.subject, emailsingle.body, emailsingle.timestamp);
    });


  //Philip's code: Archive button 
  if(mailbox ==="inbox"){
    var archivebutton = document.createElement("button");
    archivebutton.textContent = "Archive Email";
    document.querySelector('#single-email-view').appendChild(archivebutton);
    archivebutton.addEventListener('click', function(){
      fetch(`/emails/${emailsingle.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          archived: true
      })}).then(r => r.json()).then(d => console.log(d))

      load_mailbox('inbox');
    }); }else if(mailbox ==="archive"){
    var unarchivebutton = document.createElement("button");
    unarchivebutton.textContent = "Un-Archive Email";
    document.querySelector('#single-email-view').appendChild(unarchivebutton);
    unarchivebutton.addEventListener('click', function(){
      fetch(`/emails/${emailsingle.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          archived: false
      })}).then(r => r.json()).then(d => console.log(d))

      load_mailbox('inbox');
    });
  };

};