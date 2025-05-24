# Steven's techHub

[Steven's techHub](https://techhub.stevendb.xyz) s a technical content blogging platform. Although this site is now
still at its early development stage, and it serves more as my personal portfolio, it is expected to grow and scale into
a community with more user interactions in future.

I actively maintain this project as a hands-on way to sharpen my skills and explore new technologies. Every aspect of
development is relevant — from the UI and app backend to persistent storage, deployment, and CI/CD. It’s been an
enjoyable journey so far, and I look forward to gaining even more technical insights along the way.

## Visitor Account

Currently, only I can publish content to the website, but any decent users are welcomed to experience the features of
this website through a publicly shared visitor account. The login credentials are as follows:

- Username: `Visitor`
- Password: `stevenIsAwesome!`

## Features

### Markdown-Based Content

Aiming to deliver a smooth and clean reading and editing experience, every blog is stored and presented in
light-weighted Markdown format.

### First-Class Markdown Editor

At the heart of this platform is a first-class Markdown editor, built on top
of [Cherry Markdown](https://github.com/Tencent/cherry-markdown), designed for clean, intuitive writing and flexible
styling.

![demo.png#768px](https://techhub-site-content.stevendb.xyz/markdown-editor-demo.png)

### Your Dream Blogging Platform

Sick of paywalls, ads and geeky editors? Steven’s techHub is the blogging platform that you’ve always wished was there.
It is designed to be clean and distraction-free, so you can focus on what really matters: creating great content for the
world!

## Built With

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Ant-Design](https://img.shields.io/badge/-AntDesign-%230170FE?style=for-the-badge&logo=ant-design&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=Cloudflare&logoColor=white)

## Architecture

![Architecture Diagram](https://imgur.com/QU653tw.png)

The application is implemented with MERN stack, containerised using Docker for deployment. It is deployed on an AWS EC2
instance, and the service is exposed to the Internet through Cloudflare, which offers a secure and robust solution for
hosting web services.
