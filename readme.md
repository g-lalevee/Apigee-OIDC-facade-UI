[![PyPI status](https://img.shields.io/pypi/status/ansicolortags.svg)](https://pypi.python.org/pypi/ansicolortags/) 

# Apigee OIDC facade UI

**This is not an official Google product.**<BR>This implementation is not an official Google product, nor is it part of an official Google product. Support is available on a best-effort basis via GitHub.

***

This repository contains a Web UI to demonstrate OIDC scenario implemented in [Apigee GitHub DevRel Identity Facade repository](https://github.com/apigee/devrel/tree/main/references/identity-facade).

## Installation

### 1- Deploy Apigee Devrel Identity Facade Apigee Proxy

Deploy the [Apigee GitHub DevRel Identity Facade proxy](https://github.com/apigee/devrel/tree/main/references/identity-facade) following instructions provided.

Then, You must have **identity-facade-v1** proxy deployed in your Apigee organization.

Edit **identity-facade-v1** proxy to be able to send ID Token to the client App.<BR>Update OA2-GenerateAccessToken, change line:

 ```
 <Attribute name="id.token" ref="oidc.flow.jwt" display="false"/>
 ```

 to

  ```
  <Attribute name="id_token" ref="oidc.flow.jwt" display="true"/>
  ```



### 2- Clone & Configure Apigee-OIDC-facade-UI

Clone this repository.

- Install dependencies
```
npm install
```

- Copy .env_example to .env and edit file
- Edit .env file.<BR>
    - Replace CLIENT_ID and CLIENT_SECRET values by Key and Secret values copied from Apigee Application **identityApp** (created during Identity Facade deployment, step 1). Examples: 
        - Key: xkey-nnnnnnn
        - Secret: xsecret
    - Update **ISSUER=https://<APIGEEE_HOSTNAME>/v1/oauth20**, replacing <APIGEEE_HOSTNAME> by your Apigee environment hostname
    - Update **DATA_URI=https://<APIGEEE_HOSTNAME>/v1/oauth20/protected**, replacing <APIGEEE_HOSTNAME> by your Apigee environment hostname (you can also use another proxy URL & path, secured by an OAuthV2 policy, Operation=VerifyAccessToken) 


### 3- Run Apigee-OIDC-facade-UI

Start Apigee-OIDC-facade-UI

```
node app.js
```

Open a browser and connect to [http://localhost:8082/](http://localhost:8082/) et voilà !

![Apigee-OIDC-facade-UI](./images/identity-facade-UI-2.gif)

