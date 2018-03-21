# ws-service
This is a websocket server which will pipe incoming messages to chosen command thorugh
standard input and return standard output in turn. This server will run as a os service.
> Warning: This was only tested in Windows 10.

> Warning: This IS NOT production ready.

## Usage

##### Step 1
In your project directory, create a YAML file with the name you want. I will call mine: `settings.yml` (this one will be used in step 3).

##### Step 2
In `settings.yml`, write the following content:
```yaml
port: 8001
command: echo
args:
  - I am working!
```
> 1. `command` must contain a a valid shell command.
> 2. `port` defines where the HTTP server will be listening for requests.
> 3. `args` must contain a list of command line arguments.

##### Step 3
Install the server as a service with the following comands:
```bash
npm install -g ws-service
ws-service install my-project "/absolute/path/to/my/settings.yml"
```

##### Step 4
Since we are on Windows, go to Services and search for our newly created service whose name is `ws-my-project`. Start the service if it is not alreay running.

##### Step 5
You will have to [setup a little client in your browser](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications) to test our work.

## Have Questions?
Please, if you have any questions, suggestions, doubts, etc.. Don't hesitate to open issues.

Thanks!
