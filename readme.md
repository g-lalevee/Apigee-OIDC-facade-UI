[![PyPI status](https://img.shields.io/pypi/status/ansicolortags.svg)](https://pypi.python.org/pypi/ansicolortags/) 

# Apigee-OIDC-facade-UI

**This is not an official Google product.**<BR>This implementation is not an official Google product, nor is it part of an official Google product. Support is available on a best-effort basis via GitHub.

***

This repository contains a Web UI to demonstrate OIDC scenario implemented in [Apigee GitHub DevRel Identity Facade repository.](https://github.com/apigee/devrel/tree/main/references/identity-facade)

## Installation

### 1-Deploy Apigee Devrel Identity Facade Apigee Proxy

Deploy the [Apigee GitHub DevRel Identity Facade proxy.](https://github.com/apigee/devrel/tree/main/references/identity-facade) following instruction provided.

You must have **identity-facade-v1** proxy deployed in yourr Apigee organization.

Edit **identity-facade-v1** proxy to send ID Token to the client App. Update OA2-GenerateAccessToken.

Change line

 ```<Attribute name="id.token" ref="oidc.flow.jwt" display="false"/>```

 to

  ```<Attribute name="id_token" ref="oidc.flow.jwt" display="true"/>```



### 2-Clone & Configure Apigee-OIDC-facade-UI

Clone this repository.
Install dependencies
```
npm install
```




vi .env
node app.js
### Run Apigee-OIDC-facade-UI
