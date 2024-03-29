# k6 example

> ตัวอย่างการเขียน/ใช้งาน k6

<img src="./k6-icon.png" width="200">

# Table of Contens

- [Google Slide](#google-slide)
- [k6 คืออะไร ?](#k6-คืออะไร-)
- [Official Document](#official-document)
- [วิธีการใช้งาน k6](#วิธีการใช้งาน-k6)
- [Dashboard](#dashboard)
  - [การ ดู Dashboard แบบ realtime](#การ-ดู-dashboard-แบบ-realtime)
  - [การ ดู Dashboard แบบไม่ realtime](#การ-ดู-dashboard-แบบไม่-realtime)
  - [Run dashboard ผ่าน Docker](#run-dashboard-ผ่าน-docker)
  - [Export to HTML](#export-to-html)
- [Extensions](#extensions)
- [Custom k6](#custom-k6)

# Google Slide

[k6 Introduction](https://docs.google.com/presentation/d/1LOxEKgRQL0Zc2efLrvW7dVZ_gBuP-DmfPMqAUvYzwRs/edit?usp=sharing)

# k6 คืออะไร ?

- k6 เป็น Load test tool ตัวนึงที่คนนิยมใช้งานกันอยู่ในปัจจุบัน
- ถูกเขียนขึ้นด้วยภาษา Go
- กิน Resource น้อย
- ทำให้สามารถ จำลองปริมาณ Load/Virtual users ได้ในปริมาณมาก
- การกำหนด Scenario ของการ Test เขียนผ่าน Code Javascript 
- ไม่มี GUI สำหรับ Build Script (ยกเว้นแบบ On Cloud)
- มี Extensions ต่าง ๆ ให้สามารถ Install เพิ่มเติมได้
- พัฒนาโดยทีม Grafana

![](./k6-script.png)

# Official Document

[https://k6.io/docs/](https://k6.io/docs/)

# วิธีการใช้งาน k6

ในตัวอย่างนี้จะใช้งานบนเครื่อง Mac ถ้าอยากใช้งานกับ OS อื่น ๆ ให้อ่านที่เอกสาร [Installation](https://k6.io/docs/get-started/installation/) ของ k6

1. การติดตั้ง/Installation

```sh
$ brew install go
$ brew install k6
```

3. Check version

```sh
$ k6 --version
# k6 v0.48.0 (go1.21.6, darwin/amd64)
```

2. Create sample script

```sh
# Command format
# k6 new <script-name.js>

$ k6 new hello-k6.js
```

3. Run

```sh
$ k6 run hello-k6.js
```

![](how-to-use.png)

4. การ Run ผ่าน Docker 

```sh
$ docker run -v $(pwd):/script --rm -i grafana/k6 run /script/hello-k6.js 
```

![](./run-via-docker.png)

# Dashboard

1. Install **xk6**

[https://github.com/grafana/xk6/](https://github.com/grafana/xk6/)

> This command line tool and associated Go package makes it easy to make custom builds of k6. -- [Document](https://github.com/grafana/xk6)

```sh
$ go install go.k6.io/xk6/cmd/xk6@latest
```

2. Intall **k6 extension** 

[https://github.com/grafana/xk6-dashboard](https://github.com/grafana/xk6-dashboard)

```sh
$ xk6 build --with github.com/grafana/xk6-dashboard@latest
```

ถ้า run แล้วได้ error `command not found: xk6` ให้ลอง run command นี้ดู แล้วค่อย run คำสั่งด้านบนอีกที

```sh
export PATH=$(go env GOPATH)/bin:$PATH
```

![](./install-dashboard.png)

เมื่อ run เสร็จ จะได้ไฟล์ k6 มาแบบนี้

![](./install-dashboard-result.png)

ให้ใช้ k6 นี้ run dashboard แทนตัว global command 

### การ ดู Dashboard แบบ realtime

3. Run  

ใช้ `./k6` แทน `k6`

```sh
$ ./k6 run --out web-dashboard hello-k6.js
```

![](./run-with-dashboard.png)


4. เปิดดู Dashboard    

ต้องเปิดในขณะที่ Command ยัง run ไม่เสร็จ ถึงจะเปิดได้ เพราะมันต้องดูแบบ realtime เท่านั้น

[http://127.0.0.1:5665/ui/?endpoint=/](http://127.0.0.1:5665/ui/?endpoint=/)

![](./dashboard.png)

### การ ดู Dashboard แบบไม่ realtime  

จะต้อง run k6 แล้ว save result เป็น `.json` ไว้ แล้วค่อยเอามาเปิดผ่าน dashboard อีกที 

5. Run (Save output เป็น .json)

```sh
$ ./k6 run --out json=output.json hello-k6.js
```

6. Install **k6-web-dashboard**

[https://github.com/grafana/xk6-dashboard/tree/master/cmd/k6-web-dashboard](https://github.com/grafana/xk6-dashboard/tree/master/cmd/k6-web-dashboard)

> The k6-web-dashboard is a command-line tool that enables the dashboard event file (saved during the previous k6 run) to be played back (and displayed in a browser). In addition to playback, it also offers the possibility to create a single file HTML report from the event file.

```sh
$ go install github.com/grafana/xk6-dashboard/cmd/k6-web-dashboard@latest
```

7. แปลง `.json` ไปเป็น `.ndjson` (Web Dashboard support .ndjson)

```sh
$ k6-web-dashboard aggregate output.json output.ndjson
```

8. Run/Replay dashboard ผ่าน .ndjson

```sh
$ k6-web-dashboard replay output.ndjson
```

![](./replay-dashboard.png)

![](./replay-dashboard-result.png)

### Run dashboard ผ่าน Docker

```sh
$ docker run --rm -i -p 5665:5665 -v $(pwd):/script ghcr.io/grafana/xk6-dashboard:0.7.2 run --out web-dashboard /script/hello-k6.js
```

![](./run-with-dashboard-via-docker.png)

![](./dashboard-with-docker-result.png)

### Export to HTML

```sh
$ docker run --rm -i -p 5665:5665 -v $(pwd):/script ghcr.io/grafana/xk6-dashboard:0.7.2 run --out web-dashboard=export=/script/output.html /script/hello-k6.js
```

![](./export-to-html-via-docker.png)

จะได้ output เป็นไฟล์ html แบบนี้ 

![](./output-html-via-docker.png)

เมื่อเราเปิดไฟล์ดู จะได้ result หน้าตาแบบนี้

![](./output-html-1.png)

![](./output-html-2.png)

![](./output-html-3.png)

![](./output-html-4.png)

![](./output-html-5.png)

# Extensions

ดูทั้งหมดได้จาก

[https://k6.io/docs/extensions/](https://k6.io/docs/extensions/)

# Custom k6

ตัวอย่างการ Custom k6 โดยเพิ่ม dashboard และ mongodb extension เข้าไป

- xk6-dashbaord - [https://github.com/grafana/xk6-dashboard](https://github.com/grafana/xk6-dashboard)
- xk6-mongo - [https://github.com/GhMartingit/xk6-mongo](https://github.com/GhMartingit/xk6-mongo)

Dockerfile

```Dockerfile
FROM golang:latest as builder

RUN go install go.k6.io/xk6/cmd/xk6@latest

RUN xk6 build \
    --with github.com/grafana/xk6-dashboard@latest \
    --with github.com/GhMartingit/xk6-mongo@latest \
    --output /k6

FROM grafana/k6:latest
COPY --from=builder /k6 /usr/bin/k6
```

Build

```sh
$ docker build -t custom-k6 .
```

ตัวอย่างการ Run

```sh
$ docker run --rm -i -p 5665:5665 -v $(pwd):/script custom-k6 run --out web-dashboard=export=/script/output.html /script/hello-k6.js 
```

Connect Mongodb

```sh
$ docker run --rm -i -p 5665:5665 --add-host host.docker.internal:host-gateway -v $(pwd)/examples:/script custom-k6 run --out web-dashboard=export=/script/output.html /script/connect-mongodb.js
```

![](./connect-mongodb.png)
