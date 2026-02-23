export const sendNotification = (req,res) => {
    res.send("Notification endpoint hit");
    // create a new notification
    // const notification = new Notification('JavaScript Notification API', {
    //     body: 'This is a JavaScript Notification API demo',
    //     icon: 'https://i.ibb.co/Q7yGR6Ny/1.png',
    //     vibrate: true
    // });

    // // close the notification after 10 seconds
    // setTimeout(() => {
    //     notification.close();
    // }, 10 * 1000);

    // // navigate to a URL
    // notification.addEventListener('click', () => {
    //     window.open('https://www.javascripttutorial.net/web-apis/javascript-notification/', '_blank');
    // });
}