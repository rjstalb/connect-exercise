# Connect

alias - rsttecprojdemo
Identity mgmt - <https://rsttecprojdemo.my.connect.aws>
S3 - amazon-connect-438390b6a2c4/connect/rsttecprojdemo
Flow logs - /aws/connect/rsttecprojdemo
disabled customer profiles & email, and outgoing calls

rsConnectUser
ConnectUser1!

rsConnectAdmin
ConnectAdmin123!@#

+1 833-566-3579

<a id="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
<h3 align="center">AWS Connect Vanity Numbers</h3>

  <p align="center">
    AWS SAM-wrapped Connect Flow App
    <br />
    <a href="https://github.com/github_username/repo_name"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="#about-the-project">About</a>
    &middot;
    <a href="#about-the-project">Prereqs</a>
    &middot;
    <a href="#about-the-project">Install</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

This is an AWS SAM-wrapped Connect Flow App using the AWS `Serverless Application Model` absraction on `CloudFormation`. The app is a demonstration of a working Amazon Connect flow using a `Lambda` based phone caller flow to convert the caller's telephone address into vanity numbers, storing the 5 best vanity suggestions into a `DynamoDB` table. Additioinally we've added a web app that displays the vanity numbers from the last 5 callers.

#### Features

- A Lambda that converts phone numbers to vanity numbers and saves the best 5 resulting vanity numbers and the caller's number in a DynamoDB table. ("Best" explained below).
- An Amazon Connect contact flow that looks at the caller's phone number and says the 3 vanity possibilities that come back from the Lambda function.
- Leverages AWS SAM IaaC that allows a user to deploy
  - Lambda
  - Lambda association
  - contact flow
  - DynamoDB table,
  - and anything else you'd like to add into their own AWS Account/Amazon Connect instance.
- Documentation
  - Record your reasons for implementing the solution the way you did, struggles you faced and problems you overcame.
  - What shortcuts did you take that would be a bad practice in production?
  - What would you have done with more time? We know you have a life. :-)
  - What other considerations would you make before making our toy app into something that would be ready for high volumes of traffic, potential attacks from bad folks, etc.
  - Please include an architecture diagram.

### Issues and Limitations

###### Claiming phone numbers

> Amazon Connect resources are only partially supported in CloudFormation/SAM. Steps like claiming a phone number need to be handled via Console, CLI or SDK after deployment because CloudFormation does not yet support something like `AWS::Connect::PhoneNumber`.

###### Refs in Connect Flow JSON

> I was unable to correctly reference the lambda ARN using `!Sub`  or string concat/replacment piping on the Content JSON of the `AWS::Connect::ContactFlow`

###### Connect Instance modification limitations over CLI
>
> I wound up running into `StackUpdateComplete failed` likely due to update requests against `AWS::Connect::Instance`. It looks like a limitation on free/trial dev accounts.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

<https://github.com/inttter/md-badges>

- [![AWS][aws-shield]][dynamodb-url]
- [![DynamoDB][dynamodb-shield]][dynamodb-url]
- [![Next][Next.js]][Next-url]
- [![React][React.js]][React-url]
- [![Vue][Vue.js]][Vue-url]
- [![Angular][Angular.io]][Angular-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

We're assuming AWS cli tooling is installed and for (`AWS CDK` etc) and won't dive into it here.

##### IAM Setup

To ensure IAM users are prepared ahead of deploying the full application, we recommend configuring the IAM setup as a first step. If you need to create a user with the privaleges needed, see the `user.yaml` template, which can also be run using the following:

```
sam deploy --guided -t ./users.yaml --capabilities CAPABILITY_NAMED_IAM
```

This IAM User is added to a group with policies granting the user:

- Lambda management
- DynamoDB CRUD
- Connect instance + flow creation and management

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

- npm

  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Get a free API Key at [https://example.com](https://example.com)
2. Clone the repo

   ```sh
   git clone https://github.com/github_username/repo_name.git
   ```

3. Install NPM packages

   ```sh
   npm install
   ```

4. Enter your API in `config.js`

   ```js
   const API_KEY = 'ENTER YOUR API';
   ```

5. Change git remote url to avoid accidental pushes to base project

   ```sh
   git remote set-url origin github_username/repo_name
   git remote -v # confirm the changes
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

<a href="https://github.com/rjstalb">
  <img src="https://avatars.githubusercontent.com/u/7339311?v=4" alt="Logo" width="80" height="80">
</a>

[![LinkedIn](https://custom-icon-badges.demolab.com/badge/LinkedIn-0A66C2?logo=linkedin-white&logoColor=fff)](https://www.linkedin.com/in/rjstalb/)
<rjstalb@gmail.com>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[aws-shield]: https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-web-services&logoColor=white
[dynamodb-shield]: https://img.shields.io/badge/DynamoDB-4053D6?style=for-the-badge&logo=amazondynamodb&logoColor=fff
[dynamodb-url]: https://aws.amazon.com/dynamodb/

[contributors-shield]: https://img.shields.io/github/contributors/github_username/repo_name.svg?style=for-the-badge
[contributors-url]: https://github.com/github_username/repo_name/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/github_username/repo_name.svg?style=for-the-badge
[forks-url]: https://github.com/github_username/repo_name/network/members
[stars-shield]: https://img.shields.io/github/stars/github_username/repo_name.svg?style=for-the-badge
[stars-url]: https://github.com/github_username/repo_name/stargazers
[issues-shield]: https://img.shields.io/github/issues/github_username/repo_name.svg?style=for-the-badge
[issues-url]: https://github.com/github_username/repo_name/issues
[license-shield]: https://img.shields.io/github/license/github_username/repo_name.svg?style=for-the-badge
[license-url]: https://github.com/github_username/repo_name/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username

[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![project_license][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]
