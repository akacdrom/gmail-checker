function gmailCheckerLite() {
    // private vars
    var xhr;
    var soundNotification;
    var old_current =0;

    chrome.browserAction.onClicked.addListener(function() {
        chrome.tabs.create({
        url: 'https://mail.google.com'});
    });
    
    // main options & configuration
   
    gmail_atom_feed= 'https://mail.google.com/mail/u/0/feed/atom/'; //primary: ^smartlabel_personal or ^sq_ig_i_personal
    sound_notification_filepath= '../sounds/sound_2.ogg';
    

    // method that takes care of the initialization of the class
    this.setup = function() {
        self = this;

        

        // check current email  
        setInterval(function(){ self.check(); }, 60000);
        self.check();
        

        return true;
    };

    // method to check the actual gmail unread messages count
    this.check = function() {
        xhr = new XMLHttpRequest();
        if (!xhr) return false;

        // check for emails
        xhr.open("GET", gmail_atom_feed, true);
        xhr.onreadystatechange = function() {
        
            if (xhr.status == 200) {
                var xml = xhr.responseXML;
                if (xml) {
                    var count = xml.getElementsByTagName('fullcount')[0].textContent || 0;
                    var mailLink = xml.getElementsByTagName("link")[1].getAttribute("href");
                    var autohor = xml.getElementsByTagName('name')[0].textContent || 0;
                    var summary = xml.getElementsByTagName('summary')[0].textContent || 0;
                    var titleofmail = xml.getElementsByTagName('title')[1].textContent || 1;
                    
                    const notf = {
                        newMailNotf() {
                        soundNotification = new Audio(sound_notification_filepath); 
                        soundNotification.play();
                        chrome.notifications.create(
                            "",
                            {
                              type: "basic",
                              iconUrl: "img/gmail-4.png",
                              title: "Gmail - "+autohor+"\n"+titleofmail,
                              message: summary,
                            },
                            function () {
                                chrome.notifications.onClicked.addListener(function() {
                                chrome.tabs.create({
                                url: mailLink});
                                });
                            }
                          );
                        }
                    }

                    if (count > 0) {

                        chrome.browserAction.setBadgeText({text: count});
                        chrome.browserAction.setBadgeBackgroundColor({color: 'black'});

                        if (count > old_current ) {

                            notf.newMailNotf();

                            // soundNotification.play();


                            // chrome.notifications.create(
                            //     "",
                            //     {
                            //       type: "basic",
                            //       iconUrl: "img/gmail-4.png",
                            //       title: "Gmail - "+autohor+"\n"+titleofmail,
                            //       message: summary,
                            //     },
                            //     function () {
                            //         chrome.notifications.onClicked.addListener(function() {
                            //         chrome.tabs.create({
                            //         url: 'https://mail.google.com'});
                            //         });
                            //     }
                            //   );



                            // function notify(callback) {

                            //     var options = {
                            //         title:"Gmail - "+autohor+"\n"+titleofmail,
                            //         message:summary,
                            //         type: "basic", // Which type of notification to display - https://developer.chrome.com/extensions/notifications#type-TemplateType
                            //         iconUrl: "img/gmail-4.png" // A URL to the sender's avatar, app icon, or a thumbnail for image notifications.
                            //     };
                            
                            //     // The first argument is the ID, if left blank it'll be automatically generated.
                            //     // The second argument is an object of options. More here: https://developer.chrome.com/extensions/notifications#type-NotificationOptions
                            //     return chrome.notifications.create("", options, callback);
                            
                            // }
                            
                            // notify(function(){
                            //     // Do whatever you want. Called after notification is created.
                            //     chrome.notifications.onClicked.addListener(function() {
                            //         chrome.tabs.create({
                            //         url: 'https://mail.google.com'});
                            //     });
                            // });
                            old_current = count;
                        }
                    }
                    else {
                        chrome.browserAction.setBadgeText({text: ''});
                    }

                    //localStorage['gml_email_count_'+currentLoggedId] = count;
                }
                else {
                    chrome.browserAction.setBadgeText({text: 'N/A'});
                    chrome.browserAction.setBadgeBackgroundColor({color: 'red'});
                   
                }
            }
            else {
                chrome.browserAction.setBadgeText({text: 'N/A'});
                chrome.browserAction.setBadgeBackgroundColor({color: 'red'});
               
            }
        }
        xhr.send();

        return true;
    };

    return true;
}



// go, go, go!
gmail = new gmailCheckerLite();
gmail.setup();
