# Bilancio personale GIT
Bilancio personale GIT is the third version of my of my journey into the world of personal finance. All started from a simple excel file in my personale Google Drive where I used to save all my expenses and earnings. The second version was the exact copy of this without the git component. I had to create the second version because all the formulas in Excel had become to heavy to process (in the first version I only input the data and excel computed in monthly expenses/earnings and yearly expenses/earnings).
Finally the third version came out because my sister and a friend want to use this "app" to track their expenses so I added (to) git
## How to install
### Prerequisites
Have a Google Account

First of all you have to download the Google Drive App in your PC (Windows/Mac). For Linux users is not tested but I believe that you can find the way to use it.
Then download and install git and nodejs.

1. clone the repository wherever you want
2. open the terminal or the cmd in the cloned folder
3. run `npm install`
4. once its finished you can copy the bilancio-personale-GIT in your google drive folder (using the google drive app that create a "partition" on you pc)
5. you can test the app using `node app.js` or simply double clicking on app.js and choosing node.exe as default .js executor

At this point, you may be wondering why you put everything in the Google Drive folder. The answer is quickly given by the fact that in most cases I am not at my PC when I spend money I don't want to forget (such as a drink when I go out with friends) but I always have my smartphone with me. In the following points I will explain how to install everything on your Android smartphone (IOs is currently not supported due to lack of app knowledge).

6. Download from the play store DriveSync, Termux and Termux:Widget (For simplicity I recommend also to download File Manager +)
7. open your favourite file manager and create a folder (I usually call it `sync`)
8. run DriveSync and connect your Google Account
9. Choose the folder to sync between Google Drive and your smartphone (the folder created in 7) and let everything synchronise
10. Open Termux and run `termux-setup-storage` and give the permissions
11. run `apt update` and `apt upgrade` to update the mirrors
12. Once finished run `pkg install nodejs-lts` to download and install nodejs on your smartphone
13. create the shortcuts folder using the command `mkdir ~/.shortcuts/` then go inside with the command `cd ~/.shortcuts/` and create a file with `nano startnode.sh`
14. in this file copy this command and save (`sync` is the name of the folder created in point 7)
~~~~
cd /storage/emulated/0/sync && node /storage/emulated/0/sync/app.js
~~~~
15. at this point you can close the termux app and go the the home of your phone
16. open the widget selector and search for "Termux shortcut" or "Termux widget" (Depending on your smartphone, you may see one or both of them)
17. In the case you choose "Termux shortcut" on the placing you will see a page to choose the command to run, choose `startnode.sh`
18. In the other case you will see a "table" listing all command stored in `~/.shortcuts/`

At this point the DriveSync synchronisation should be finished and if you tap on the "app" added to your home screen in point 17/18, the express server should start and a browser page should be visible right after.

Note that this documentation is experimental and its based only on few installation on family and friends devices.
