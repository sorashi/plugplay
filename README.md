plugplay
===

plugplay is a Node.js script that streams songs from any plug.dj room using youtube-dl and ffplay. It uses almost no CPU power and only ~25MB of RAM.

The project is currently not user-friendly and requires some degree of technical knowledge to set up.

There may be a desktop UI made in the future if requested by users (but that would defeat the purpose of being low profile as the UI would use Electron, which is a Chromium window).

# Setup
If you're using Windows [install Chocolatey](https://chocolatey.org/install),
it's a package manager for Windows. If you're using anything else, use your
system's package manager instead of Chocolatey. The packages should be available for most operating systems.

1. install Node.js LTS (it's important that it's LTS, because some of our
dependencies contain native code and need to be compiled and the code doesn't
work with latest Node's V8 engine for some reason)

```
choco install nodejs-lts
```

2. install youtube-dl and ffmpeg packages
```
choco install youtube-dl ffmpeg
```

3. install yarn
```
choco install yarn
```

4. clone this repo and restore packages
```
git clone https://github.com/sorashi/plugplay.git
cd plugplay
yarn
```

5. Open config.json and edit with your plug.dj credentials. Logging in using
Facebook is supported, but not recommended (we recommend you create a new plug.dj account).

6. Find your Soundcloud client id. You can do so by sniffing a Soundcloud's song download request using Chrome's dev tools.
    - Login to Soundcloud
    - Go to a [downloadable song](https://soundcloud.com/lilnepsenpai/imouto-lookin-cute-in-a-mini-skirt-prod-sweets).
    - Open dev tools (F12 or CTRL+SHIFT+I). Open the Network tab and select XHR as filter.
    - Click `More → Download file`. A download request should appear in the Network tab.
    - Click it and find the client id. See image below for guidance. Paste the id in config.json as
`soundcloud_client_id`.

![](https://i.imgur.com/MWSc0yC.png)

7. set your desired room id in config.json as `room`, for example https://plug.dj/drum-bass would be `drum-bass`

8. run the script
```
node index.js
```

9. enjoy

# Known issues
- sometimes there are two songs playing layered over each other for a few seconds before one of them gets stopped
- sometimes a song gets stuck (stops playing), it's an issue with ffplay, the only workaround is to either wait for the next song or restart the script
- [report any issues](/issues)