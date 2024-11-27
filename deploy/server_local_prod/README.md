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
>copy the contents from `/home/intron/intronhealth/deploy/server_local_prod/ngrok.yml` into the config file
>
> ensure the `hostname` field is set to the domain that was aquired from ngrok

### setup ngrok service

> `cp /home/intron/intronhealth/deploy/server_local_prod/systemd_services/intron_emr_ngrok.service /etc/systemd/system/`
>
> `systemctl enable intron_emr_ngrok.service`
>
> `systemctl restart intron_emr_ngrok.service`


---
## *SETUP-RESOURCE-POSTGRES*

### install postgresql

[Digital ocean install postgres](https://www.digitalocean.com/community/tutorials/how-to-install-postgresql-on-ubuntu-20-04-quickstart)

> `sudo apt update`
>
> `sudo apt install postgresql postgresql-contrib`

### create user with password and permissions

> `sudo su postgres`
>
> `psql`
>
> `CREATE USER intron_health_app WITH PASSWORD 'intron_health_app';`
>
> `ALTER USER intron_health_app WITH SUPERUSER;`
>
> `ALTER USER intron_health_app WITH LOGIN;`
>
> `\q`
>
> `\exit`

### create database

> `sudo -i -u postgres`
>
> `createdb intron_health_app`
>
> `\exit`

### edit postgres config for local access

these enables the database to recieve connections from any ip.

these setting will allow connection via the 5432 port open on the public ip.

> `sudo nano /etc/postgresql/12/main/pg_hba.conf`

keep scrolling or find this section.

then add this new line

```sh
local   all             intron_health_app                       md5
```

```sh
# DO NOT DISABLE!
# If you change this first entry you will need to make sure that the
# database superuser can access the database using some other method.
# Noninteractive access to all databases is required during automatic
# maintenance (custom daily cronjobs, replication, and similar tasks).
#
# Database administrative login by Unix domain socket
local   all             postgres                                peer
local   all             intron_health_app                       md5

# TYPE  DATABASE        USER            ADDRESS                 METHOD

# "local" is for Unix domain socket connections only
local   all             all                                     peer
# IPv4 local connections:
host    all             all             0.0.0.0/0               md5
# IPv6 local connections:
host    all             all             ::1/128                 md5
# Allow replication connections from localhost, by a user with the
# replication privilege.
local   replication     all                                     peer
host    replication     all             0.0.0.0/0               md5
host    replication     all             ::1/128                 md5
```

```sh
sudo nano /etc/postgresql/12/main/postgresql.conf
```

keep scrolling or search for this line

```sh
#------------------------------------------------------------------------------
# CONNECTIONS AND AUTHENTICATION
#------------------------------------------------------------------------------

# - Connection Settings -

listen_addresses = '*'         # what IP address(es) to listen on;
                                        # comma-separated list of addresses;
                                        # defaults to 'localhost'; use '*' for all
                                        # (change requires restart)
port = 5432                             # (change requires restart)
```

### enable and restrat postgres service

```sh
systemctl enable postgresql.service

systemctl restart postgresql.service
```

---

## *SETUP-RESOURCE-REDIS*

### install redis

[Digital ocean guide for redis config](https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-redis-on-ubuntu-20-04)


> sudo apt install redis-server
>
> sudo nano /etc/redis/redis.conf

### configure redis

keep scrolling or search for this

```sh
################################# GENERAL #####################################

# By default Redis does not run as a daemon. Use 'yes' if you need it.
# Note that Redis will write a pid file in /var/run/redis.pid when daemonized.
daemonize yes

# If you run Redis from upstart or systemd, Redis can interact with your
# supervision tree. Options:
#   supervised no      - no supervision interaction
#   supervised upstart - signal upstart by putting Redis into SIGSTOP mode
#   supervised systemd - signal systemd by writing READY=1 to $NOTIFY_SOCKET
#   supervised auto    - detect upstart or systemd method based on
#                        UPSTART_JOB or NOTIFY_SOCKET environment variables
# Note: these supervision methods only signal "process is ready."
#       They do not enable continuous liveness pings back to your supervisor.
supervised systemd
```

```sh
sudo systemctl restart redis.service
```

---

## *SETUP-RESOURCE-RABBITMQ*

### install rabbitMq

```sh
sudo apt-get install wget apt-transport-https -y

wget -O- https://www.rabbitmq.com/rabbitmq-release-signing-key.asc | sudo apt-key add -

echo "deb https://dl.bintray.com/rabbitmq-erlang/debian focal erlang-22.x" | sudo tee /etc/apt/sources.list.d/rabbitmq.list

sudo apt-get install rabbitmq-server -y --fix-missing

sudo systemctl status rabbitmq-server
```

---

## *SETUP LIBRARIES*

### Conda

[Digital ocean guide for conda install](https://www.digitalocean.com/community/tutorials/how-to-install-the-anaconda-python-distribution-on-ubuntu-20-04)

> `cd /tmp`
>
> `curl https://repo.anaconda.com/archive/Anaconda3-2024.06-1-Linux-x86_64.sh --output anaconda.sh`
>
> `sha256sum anaconda.sh`
>
> `bash anaconda.sh`
>
> `source ~/.bashrc`
>
> `cd ~`

---

## *Install Linux libraries*

> `apt install gcc`
>
> `apt-get install wkhtmltopdf`

---

## *SETUP-ENV*

### Create enviroment

> `conda create -n intronhealthvenv python=3.7`

### Activate enviroment

> `conda activate intronhealthvenv`

### repo clone

> `git clone https://github.com/intron-innovation/intronhealth.git`

### install requirements

> `cd intronhealth`
>
> `pip install -r requirements.txt`

### Create .env file from template

get the .env file from devs/admins


> `nano /home/intron/intronhealth/.env`

### Run migrations

> `bash scripts/run_migrations.sh -u production`

### sync pull data from remote

> `bash scripts/run_sync_v2_first_pull.sh production`

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

### gunnicorn

> `cp /home/intron/intronhealth/deploy/server_local_prod/systemd_services/intron_emr_gunicorn.service /etc/systemd/system/`
>
> `systemctl enable intron_emr_gunicorn.service`
>
> `systemctl restart intron_emr_gunicorn.service`

### celery

> `cp /home/intron/intronhealth/deploy/server_local_prod/systemd_services/intron_emr_celery.service /etc/systemd/system/`
>
> `systemctl enable intron_emr_celery.service`
>
> `systemctl restart intron_emr_celery.service`

### celery-beat

> `cp /home/intron/intronhealth/deploy/server_local_prod/systemd_services/intron_emr_celery_beat.service /etc/systemd/system/`
>
> `systemctl enable intron_emr_celery_beat.service`
>
> `systemctl restart intron_emr_celery_beat.service`