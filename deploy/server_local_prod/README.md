# *Intronhealth Local production setup*

## *SETUP-ACCESS*

### create user

> `adduser intron`
>
>  `usermod -aG sudo intron`
>
> `su - intron`

---

## *SETUP-NGROK*

### install ngrok

[Ngrok site](https://ngrok.io)

get the auth token from the admins

> `snap install ngrok`
>
> `ngrok config add-authtoken xxxxxxx`
>
> check where the config file is located
> >
> > `ngrok check config`
>
>copy the contents from `/home/intron/viewer/deploy/server_local_prod/ngrok.yml` into the config file
>
> ensure the `hostname` field is set to the domain that was aquired from ngrok

### setup ngrok service

> `cp /home/intron/viewer/deploy/server_local_prod/systemd_services/intron_viewer_gunicorn.service /etc/systemd/system/`
>
> `systemctl enable intron_viewer_gunicorn.service`
>
> `systemctl restart intron_viewer_gunicorn.service`



## Installation Guide: Node.js, npm, and yarn on Ubuntu Server

#### Prerequisites
Ensure you have curl and wget installed. If not, run:


> `sudo apt update`
> `sudo apt install -y curl wget`
### Step 1: Install Node.js (v22.9.0) and npm
#### Add the Node.js repository:
> `curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -`

#### Install Node.js and npm:
> `sudo apt install -y nodejs`

#### Verify the installation:


> `node -v`   # Should return v22.9.0
> `npm -v `   # Should return 10.8.3

### Step 2: Install yarn (v1.22.22)
#### Add the yarn repository:

> `curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -`
> `echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list`
#### Update package index and install yarn:
> ` sudo apt update`
> ` sudo apt install -y yarn`
#### Verify the installation:
> `yarn -v   # Should return 1.22.22`












---
## *SETUP-NGINX*

### install nginx

> `apt install nginx`

### edit ssl conf

> open deploy/server_local_prod/openssl.cnf
>
> relaplace all 127.0.0.1 with the servers ip address

### setup nginx unsigned

> `sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -config /home/intron/intronhealth/deploy/server_local_prod/openssl.cnf -keyout /etc/ssl/private/nginx-selfsigned.key -out /etc/ssl/certs/nginx-selfsigned.crt`
>
> `sudo cp /home/intron/intronhealth/deploy/server_local_prod/dhparam.pem /etc/nginx`

### setup nginx conf links for http and https

> `sudo cp /home/intron/intronhealth/deploy/server_local_prod/intron_emr_nginx_local_prod.conf /etc/nginx/sites-available`
>
> `sudo ln -s /etc/nginx/sites-available/intron_emr_nginx_local_prod.conf /etc/nginx/sites-enabled/`
>
> change the nginx user from www-data to intron

### test nginx conf

> `sudo nginx -t`

if the test pass then reload

> `sudo nginx -s reload`

---
## *SETUP,ENABLE AND START SERVICES*
