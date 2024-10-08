# Steven's techHub

[Steven's techHub](https://techhub.stevendb.xyz) is a markdown-based blogging platform. As a software engineer and
developer exposed to extensive technical content on a daily basis, I need a place to take notes and organise my
thoughts, and I think it would be cool if I share some tricks and insights to the community. This platform is well
crafted for this purpose, and it will be actively maintained as long as I stay in the industry (I don't see the day I
quit though, 'cause I love it). For now only I and a visitor account can post content onto this website, concerning the
project scale, budget and my time. However, more users will be welcomed to contribute to building this community, and
more interactive features are expected to be introduced to the platform, such as comments and likes.

This is a personal project I started mainly to expand my skill sets and enhance my technical proficiency. Therefore,
every development aspects are relevant, including UI, app backend, persistent storage, deployment and CI/CD. It's a
really enjoyable journey, and I look forward to gain more technical insights through this project.

## Visitor account

Currently, only I can publish content to the website, but any decent users are welcomed to experience the features of
this website through a shared visitor account. The login detail is as follows:

- Username: `Visitor`
- Password: `stevenIsAwesome!`

## Built with

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

## TODO

The following features are expected in the system in the near future:

- [ ] Auto save blogs;
- [ ] Comment blog posts;
- [ ] Like blog posts.
