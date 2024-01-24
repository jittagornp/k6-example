# k6s example

> ตัวอย่างการเขียน/ใช้งาน k6s

# วิธีการใช้งาน k6s

ในตัวอย่างนี้จะใช้งานบนเครื่อง Mac นะครับ ถ้าอยากใช้งานกับ OS อื่น ๆ ให้อ่านที่เอกสาร [Installation](https://k6.io/docs/get-started/installation/)

1. การติดตั้ง/Installation

```sh
brew install go
brew install k6
```

3. Check version

```sh
k6 --version
# k6 v0.48.0 (go1.21.6, darwin/amd64)
```

2. Create sample script

```sh
# Command format
# k6 new <script-name.js>

k6 new hello-k6s.js
```

3. Run

```sh
k6 run hello-k6s.js
```

![](how-to-use.png)

4. การ Run ผ่าน Docker 

```sh
docker run -v $(pwd):/script --rm -i grafana/k6 run /script/hello-k6s.js 
```

![](./run-via-docker.png)
