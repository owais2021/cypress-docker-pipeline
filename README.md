<h1><strong>Automating Cypress Tests with Jenkins and Docker: A Step-by-Step Guide - CI/CD Pipeline for Cypress Testing</strong></h1>
<h3><strong>Introduction</strong></h3>
<p>This guide walks you through setting up a Cypress testing framework using a Page Object Model (POM) structure, integrating it with Jenkins for Continuous Integration (CI), and running tests in different environments (QA, Staging, Production). The setup includes Docker for containerization, Jenkins for CI automation, and Cypress for end-to-end testing.</p>
<p>Key components of the setup include:</p>
<ul>
<li><strong>Cypress</strong>: For end-to-end testing, providing robust and reliable test automation.</li>
<li><strong>Jenkins</strong>: For automating the CI/CD pipeline, managing test execution, and handling build processes.</li>
<li><strong>Docker</strong>: For containerization, ensuring consistent test environments and simplifying deployment.</li>
</ul>
<p>Additionally, if you already have a pre-built Docker image for your Cypress tests, you can reuse that image rather than rebuilding it each time. This approach can save time, especially if the dependencies or test code haven&rsquo;t changed.</p>

![image](https://github.com/user-attachments/assets/592b6151-3da3-483f-88de-5722afd89976)
<h3><strong>Workflow Description:</strong></h3>
<ul>
<li><strong>Cypress Script Push on GitHub:</strong> The Cypress script is pushed to the GitHub repository.</li>
<li><strong>Clone Repository:</strong> The Jenkins pipeline is triggered, and it clones the repository from GitHub to the Jenkins workspace.</li>
<li><strong>Build Docker Image:</strong> Jenkins uses the Dockerfile from the cloned repository to build a Docker image.</li>
<li><strong>Push Docker Image:</strong> The built Docker image is then pushed to Docker Hub.</li>
<li><strong>Pull from Docker Hub:</strong> The Docker image is pulled from Docker Hub in the target environment QA, stage or Prod.</li>
<li><strong>Run Cypress Tests:</strong> The Cypress tests are executed inside the Docker container that runs the pulled image.</li>
<li><strong>Clean Up Jenkins Workspace:</strong> Finally, the Jenkins workspace is cleaned up after the pipeline finishes.</li>
</ul>
<h4><strong>Cypress Project Structure</strong></h4>
<ul>
<li>The project is organized as follows:</li>
</ul>

![image](https://github.com/user-attachments/assets/30fd363b-a354-4c24-8535-89bac1a4d6fc)
<h4><strong>Prerequisites</strong></h4>
<p>Before you start, make sure you have the following:</p>
<ul>
<li>Docker installed on the Jenkins server.</li>
<li>Access to a Docker Hub account for pushing images.</li>
<li>A Cypress test suite ready in your project.</li>
<li>Jenkins installed and configured.</li>
</ul>
<h3><strong>Step 1: Set Up Docker</strong></h3>
<p><strong>1. Install Docker Desktop:</strong></p>
<ul>
<li>Download and install Docker Desktop from Docker's <a href="https://docs.docker.com/desktop/install/windows-install/">official website</a>.</li>
</ul>
<ul>
<li>Ensure Docker Desktop is running.</li>
</ul>
<p><strong>2. Enable WSL 2 Backend:</strong></p>
<ul>
<li>Docker Desktop uses WSL 2 as the backend on Windows for better performance.</li>
<li>Ensure WSL 2 is enabled by following the instructions during Docker Desktop installation.</li>
</ul>
<h3><strong>Step 2: Set Up Cypress in Docker</strong></h3>
<p><strong>1. Create a Cypress Project:</strong></p>
<ul>
<li>If you don&rsquo;t already have a Cypress project, create one by running</li>
</ul>
<p style="padding-left: 30px;"><strong><span style="background-color: #ffffff;"><em>mkdir cypress-docker</em></span></strong></p>
<p style="padding-left: 30px;"><strong><span style="background-color: #ffffff;"><em>cd cypress-docker</em></span></strong></p>
<p style="padding-left: 30px;"><strong><span style="background-color: #ffffff;"><em>npm init -y</em></span></strong></p>
<p style="padding-left: 30px;"><strong><span style="background-color: #ffffff;"><em>npm install cypress&nbsp; </em></span></strong></p>
<p><strong>2. Create Dockerfile:</strong></p>
<ul>
<li>In the root of your Cypress project, create a Dockerfile to define the Docker image:</li>
</ul>
<ul>
<li style="text-align: left;"><strong><em># Use the official Cypress Docker image</em></strong></li>
<li style="text-align: left;"><strong><em>FROM cypress/included:17.3</em></strong></li>
<li style="text-align: left;"></li>
<li style="text-align: left;"><strong><em># Create a working directory inside the container</em></strong></li>
<li style="text-align: left;"><strong><em>WORKDIR /e2e</em></strong></li>
<li style="text-align: left;"></li>
<li style="text-align: left;"><strong><em># Copy the entire project directory contents into the container</em></strong></li>
<li style="text-align: left;"><strong><em>COPY . .</em></strong></li>
<li style="text-align: left;"></li>
<li style="text-align: left;"><strong><em># Install dependencies</em></strong></li>
<li style="text-align: left;"><strong><em>RUN npm install</em></strong></li>
<li style="text-align: left;"></li>
<li style="text-align: left;"><strong><em># Run Cypress tests by default</em></strong></li>
<li style="text-align: left;"><strong><em>CMD ["npx", "cypress", "run"]</em></strong></li>
</ul>
<p>&nbsp;<strong>Example:</strong></p>

![image](https://github.com/user-attachments/assets/0204ef5a-753f-4f94-a008-8e9a2ded1124)
<p><strong>3. Create Docker Compose File:</strong></p>
<ul>
<li>Create a docker-compose.yml file to define services:</li>
</ul>
<ul>
<li><strong><em>version: '3.8'</em></strong></li>
<li><strong><em>services:</em></strong></li>
<li><strong><em>cypress:</em></strong></li>
<li><strong><em>&nbsp; build: .</em></strong></li>
<li><strong><em>&nbsp; volumes:</em></strong></li>
<li><strong><em>&nbsp; &nbsp; - .:/e2e</em></strong></li>
<li><strong><em>&nbsp; working_dir: /e2e</em></strong></li>
<li><strong><em>&nbsp; command: ["npx", "cypress", "run"]</em></strong></li>
<li><strong><em>&nbsp; environment:</em></strong></li>
<li><strong><em>&nbsp; &nbsp; - CYPRESS_ENV=qa</em></strong></li>
</ul>
<p><strong>Example:</strong></p>

![image](https://github.com/user-attachments/assets/68ff41ae-5702-4d62-9a86-2c27958ed0aa)
<h3><strong>Step 3: Configure Cypress Environment</strong></h3>
<p><strong>1. Create Cypress Configuration Files:</strong></p>
<ul>
<li>Create configuration files for different environments (QA, stage, prod):</li>
</ul>
<ul>
<li><strong>cypress/config/QA-config.config.js:<br /> </strong>This URL is for the QA environment: <a href="https://www.amazon.ae">https://www.amazon.ae</a></li>
</ul>
<ul>
<li><em><strong>module.exports = {</strong></em></li>
<li><em><strong>baseUrl: 'https://www.amazon.ae/',</strong></em></li>
<li><em><strong>// other configuration options</strong></em></li>
<li><em><strong>};&nbsp;</strong></em></li>
</ul>
<p><strong>Example:</strong></p>

![image](https://github.com/user-attachments/assets/e8170517-187e-41ee-a4f0-e9a34ff98c23)
<ul>
<li><strong>cypress/config/stage-config.config.js:<br /> </strong>This URL is for the stage environment: <a href="https://www.amazon.de">https://www.amazon.de</a></li>
</ul>
<ul>
<li><em><strong>module.exports = {</strong></em></li>
<li><em><strong>baseUrl: 'https://www.amazon.de/',</strong></em></li>
<li><em><strong>// other configuration options</strong></em></li>
<li><em><strong>};</strong></em></li>
</ul>
<p><strong>&nbsp;</strong><strong>Example:</strong></p>

![image](https://github.com/user-attachments/assets/312c10d9-0523-4cf1-93f5-e64ca3a41ed9)
<ul>
<li><strong>cypress/config/prod-config.config.js:<br /> </strong>This URL is for the prod environment: <a href="https://www.amazon.com">https://www.amazon.com</a></li>
</ul>
<ul>
<li><em><strong>module.exports = {</strong></em></li>
<li><em><strong>baseUrl: 'https://www.amazon.com/',</strong></em></li>
<li><em><strong>// other configuration options</strong></em></li>
<li><em><strong>};</strong></em></li>
</ul>
<p><strong>Example:</strong></p>

![image](https://github.com/user-attachments/assets/210ab236-1ba1-4045-bf9f-abcbd7141b50)
<p><strong>2. Modify cypress.config.js to Load Configuration Based on Environment:</strong></p>
<ul>
<li>Create or update cypress.config.js to dynamically load the configuration:</li>
</ul>
<ul>
<li><em><strong>const { defineConfig } = require('cypress');</strong></em></li>
<li></li>
<li><em><strong>// Load environment-specific configurations</strong></em></li>
<li><em><strong>const qaConfig = require('./cypress/config/QA-config.config.js');</strong></em></li>
<li><em><strong>const stageConfig = require('./cypress/config/stage-config.config.js');</strong></em></li>
<li><em><strong>const prodConfig = require('./cypress/config/prod-config.config.js');</strong></em></li>
<li></li>
<li><em><strong>let envConfig;</strong></em></li>
<li></li>
<li><em><strong>switch (process.env.CYPRESS_ENV) {</strong></em></li>
<li><em><strong>case 'qa':</strong></em></li>
<li><em><strong>&nbsp; envConfig = qaConfig;</strong></em></li>
<li><em><strong>&nbsp; break;</strong></em></li>
<li><em><strong>case 'stage':</strong></em></li>
<li><em><strong>&nbsp; envConfig = stageConfig;</strong></em></li>
<li><em><strong>&nbsp; break;</strong></em></li>
<li><em><strong>case 'prod':</strong></em></li>
<li><em><strong>&nbsp; envConfig = prodConfig;</strong></em></li>
<li><em><strong>&nbsp; break;</strong></em></li>
<li><em><strong>default:</strong></em></li>
<li><em><strong>&nbsp; envConfig = qaConfig;</strong></em></li>
<li><em><strong>}</strong></em></li>
</ul>
<p>&nbsp;<strong>Example: </strong></p>

![image](https://github.com/user-attachments/assets/1c246ff7-df62-4f73-84c8-b4da161a5806)
<h3><strong>Step 4: Run locally in system: Building and Running the Docker Container</strong></h3>
<p><strong>1. Build The Docker Image:</strong></p>
<ul>
<li>Open a terminal and navigate to your project directory.</li>
<li>Run the following command to build the Docker image:</li>
</ul>
<p style="padding-left: 30px;"><strong><em>docker build -t my-cypress-tests .</em></strong></p>
<p><strong>Example Output:</strong></p>

![image](https://github.com/user-attachments/assets/bc2916c7-4338-440c-a5eb-aaf6e02b3731)
<p><strong>2. Run the Docker Container:</strong></p>
<ul>
<li>Run the following command to start the container and execute the Cypress tests:</li>
</ul>
<p style="padding-left: 30px;"><strong><em>docker run --rm my-cypress-tests</em></strong></p>
<p><strong><em>&nbsp;</em></strong><strong>Example Output:</strong></p>

![image](https://github.com/user-attachments/assets/c53697a9-b3ce-495d-a8cf-c067edf3a43e)
![image](https://github.com/user-attachments/assets/6161407e-8edb-441f-b53f-519d9b7a8e4f)
![image](https://github.com/user-attachments/assets/e38d1220-516e-4954-a340-a36df93c7b0f)
<p><strong>Running Cypress with Environment Variables:</strong></p>
<p>When running Cypress, set the CYPRESS_ENV environment variable to specify the environment configuration to use.</p>
<p>For example:</p>
<ul>
<li>For QA Environment:</li>
</ul>
<p style="padding-left: 30px;"><strong><em>CYPRESS_ENV=qa npx cypress run</em></strong></p>
<ul>
<li>For Stage Environment:</li>
</ul>
<p style="padding-left: 30px;"><strong><em>CYPRESS_ENV=stage npx cypress run</em></strong></p>
<ul>
<li>For Production Environment:</li>
</ul>
<p style="padding-left: 30px;"><strong><em>CYPRESS_ENV=prod npx cypress run</em></strong></p>
<h3>&nbsp;<strong>If you are using Docker, you can pass the environment variable like this:</strong></h3>
<p style="padding-left: 30px;"><strong><em>docker run --rm -e CYPRESS_ENV=prod my-cypress-tests</em></strong></p>
<h3><strong>Step 5: Set Up Jenkins for CI/CD</strong></h3>
<p>Now, integrate Jenkins with your GitHub repository and Docker Hub.</p>
<p><strong>1. Install Necessary Jenkins Plugins:</strong></p>
<ul>
<li>Docker Pipeline Plugin</li>
<li>GitHub Integration Plugin</li>
</ul>
<p><strong>2. Create Jenkins Pipeline Job:</strong></p>
<ul>
<li>Open Jenkins Dashboard</li>
<li>Go to New Item.</li>
<li>Enter the job name (e.g., <strong>cypress-integration-docker</strong>).</li>
<li>Select Pipeline and click OK.</li>
</ul>
<p><strong>3. Configure Pipeline Job:</strong></p>
<ul>
<li>Go to Pipeline section.</li>
<li>Select Pipeline script from SCM.</li>
<li>SCM: Git.</li>
<li>Repository URL: https://github.com/owais2021/cypress-docker-pipeline.git.</li>
<li>Branch Specifier: */master</li>
</ul>
<p><strong>4. Add Jenkinsfile to Your</strong><strong> cypress project</strong> <strong>or </strong><strong>Repository:</strong></p>
<ul>
<li>Create a <strong>Jenkinsfile</strong> in cypress project</li>
</ul>
<ul>
<li><em><strong>pipeline {</strong></em></li>
<li><em><strong>&nbsp; agent any</strong></em></li>
<li></li>
<li><em><strong>&nbsp; environment {</strong></em></li>
<li><em><strong>&nbsp; &nbsp; &nbsp; DOCKER_HUB_CREDENTIALS = credentials('DOCKER_HUB_CREDENTIALS')</strong></em></li>
<li><em><strong>&nbsp; &nbsp; &nbsp; CYPRESS_ENV = 'stage'</strong></em></li>
<li><em><strong>&nbsp; }</strong></em></li>
<li></li>
<li><em><strong>&nbsp; stages {</strong></em></li>
<li><em><strong>&nbsp; &nbsp; &nbsp; // // Uncomment this stage if you need to clone the repository</strong></em></li>
<li><em><strong>&nbsp; &nbsp; &nbsp; stage('Clone Repository') {</strong></em></li>
<li><em><strong>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; steps {</strong></em></li>
<li><em><strong>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; git url: 'https://github.com/owais2021/cypress-docker-pipeline.git', branch: 'master'</strong></em></li>
<li><em><strong>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; }</strong></em></li>
<li><em><strong>&nbsp; &nbsp; &nbsp; }</strong></em></li>
<li></li>
<li><em><strong>&nbsp; &nbsp; &nbsp; stage('Build Docker Image') {</strong></em></li>
<li><em><strong>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; steps {</strong></em></li>
<li><em><strong>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; script {</strong></em></li>
<li><em><strong>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; docker.build('owaiskhan216/my-cypress-tests:latest')</strong></em></li>
<li><em><strong>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; }</strong></em></li>
<li><em><strong>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; }</strong></em></li>
<li><em><strong>&nbsp; &nbsp; &nbsp; }</strong></em></li>
<li></li>
<li><em><strong>&nbsp; &nbsp; &nbsp; stage('Push Docker Image to Docker Hub') {</strong></em></li>
<li><em><strong>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; steps {</strong></em></li>
<li><em><strong>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; script {</strong></em></li>
<li><em><strong>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; docker.withRegistry('https://index.docker.io/v1/', 'DOCKER_HUB_CREDENTIALS') {</strong></em></li>
<li><em><strong>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; docker.image('owaiskhan216/my-cypress-tests:latest').push('latest')</strong></em></li>
<li><em><strong>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; }</strong></em></li>
<li><em><strong>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; }</strong></em></li>
<li><em><strong>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; }</strong></em></li>
<li><em><strong>&nbsp; &nbsp; &nbsp; }</strong></em></li>
<li></li>
<li><em><strong>&nbsp; &nbsp; &nbsp;// / Pull and Run Docker Image from Docker Hub</strong></em></li>
<li><em><strong>&nbsp; &nbsp; &nbsp;stage('Run Cypress Tests') {</strong></em></li>
<li><em><strong>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; steps {</strong></em></li>
<li><em><strong>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; script {</strong></em></li>
<li><em><strong>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; def workspacePath = "${WORKSPACE}".replace('\\', '/').replace('C:', '/c')</strong></em></li>
<li><em><strong>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</strong></em></li>
<li><em><strong>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; // Pull the Docker image</strong></em></li>
<li><em><strong>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; powershell """</strong></em></li>
<li><em><strong>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; docker pull owaiskhan216/my-cypress-tests:latest</strong></em></li>
<li><em><strong>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; """</strong></em></li>
<li></li>
<li><em><strong>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; // Run the Cypress tests inside the Docker container</strong></em></li>
<li><em><strong>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; powershell """</strong></em></li>
<li><em><strong>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; docker run --rm `</strong></em></li>
<li><em><strong>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; -e CYPRESS_ENV=${CYPRESS_ENV} `</strong></em></li>
<li><em><strong>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; -v ${workspacePath}:${workspacePath} `</strong></em></li>
<li><em><strong>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; -w ${workspacePath} `</strong></em></li>
<li><em><strong>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; owaiskhan216/my-cypress-tests:latest `</strong></em></li>
<li><em><strong>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; npx cypress run</strong></em></li>
<li><em><strong>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; """</strong></em></li>
<li><em><strong>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; }</strong></em></li>
<li><em><strong>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; }</strong></em></li>
<li><em><strong>&nbsp; &nbsp; &nbsp; }</strong></em></li>
<li></li>
<li><em><strong>&nbsp; }</strong></em></li>
<li></li>
<li><em><strong>&nbsp;</strong></em></li>
<li></li>
<li><em><strong>&nbsp; post {</strong></em></li>
<li><em><strong>&nbsp; &nbsp; &nbsp; always {</strong></em></li>
<li><em><strong>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; cleanWs()</strong></em></li>
<li><em><strong>&nbsp; &nbsp; &nbsp; }</strong></em></li>
<li><em><strong>&nbsp; }</strong></em></li>
<li><em><strong>}&nbsp;</strong></em></li>
</ul>
<p><strong>Example:</strong></p>

![image](https://github.com/user-attachments/assets/6e472bbb-4264-4229-a44e-d41c71d17d49)
<p><strong>Explanation:</strong></p>
<ul>
<li><strong>Clone Repository:</strong> Clones the GitHub repository.</li>
<li><strong>Build Docker Image:</strong> Builds the Docker image from the Dockerfile.</li>
<li><strong>Push Docker Image:</strong> Pushes the built Docker image to Docker Hub.</li>
<li><strong>Pull from Docker Hub</strong>: Pull and Run Docker Image from Docker Hub</li>
<li><strong>Run Cypress Tests:</strong> Runs Cypress tests inside the Docker container.</li>
<li><strong>Cleaned up Ws: </strong>Jenkins workspace is always cleaned up after the pipeline finishes</li>
</ul>
<h3><strong>Step 6: Create Docker Hub Credentials in Jenkins</strong></h3>
<p><strong>1. Go to Jenkins Dashboard:</strong></p>
<ul>
<li>Click on Manage Jenkins.</li>
<li>Click on Manage Credentials.</li>
<li>Select the appropriate domain (e.g., Global credentials).</li>
<li>Click on Add Credentials.</li>
</ul>
<p><strong>2. Add Docker Hub Credentials:</strong></p>
<ul>
<li>Kind: Username with password.</li>
<li>Scope: Global.</li>
<li>ID: DOCKER_HUB_CREDENTIALS</li>
<li>Username: &lt;your-docker-hub-username&gt;.</li>
<li>Password: &lt;your-docker-hub-password&gt;.</li>
</ul>
<h3><strong>Step 7: Trigger Jenkins Pipeline</strong></h3>
<p><strong>1. Go to Your Jenkins Job:</strong></p>
<ul>
<li>Click on Build Now.</li>
<li>Monitor the build process in the Build History.</li>
</ul>
<h3><strong>Step 8: Monitor and Review Results</strong></h3>
<p><strong>1. Monitor Build Logs:</strong></p>
<ul>
<li>Click on the build number in the Build History.</li>
<li>View the Console Output to monitor the progress.</li>
</ul>
<p><strong>2. Review Cypress Test Results:</strong></p>
<ul>
<li>If tests fail, review the logs to identify issues.</li>
<li>Fix issues in your code, commit, and push changes to GitHub to trigger the pipeline again.</li>
</ul>
<p><strong>3. Docker Desktop <br /> </strong><br /> We can run the Docker image directly from Docker Desktop for local testing. This provides an easy way to manage and execute containers on your development machine.</p>

![image](https://github.com/user-attachments/assets/eb765523-4ff5-4ca9-b5d9-e11e9729320e)
<p><strong>4. Docker HUB:<br /> </strong><br /> We can pull and run the Docker image from Docker Hub, which allows us to use the same image across different environments. This ensures consistency in testing and deployment.</p>

![image](https://github.com/user-attachments/assets/06d50bb9-98d7-4c32-be24-a21ca6d8e12b)
<p><strong>5. Jenkins Job:</strong></p>
<p>This is Jenkins job</p>

![image](https://github.com/user-attachments/assets/d1e6927c-3d14-4fd9-9161-11458cb46363)
<p><strong>6. This is Jenkins pipeline flow</strong></p>

![image](https://github.com/user-attachments/assets/d514bee8-3cd7-41af-8aee-06a3889a4b1d)
<p><strong>7. Jenkins Configuration</strong></p>

![image](https://github.com/user-attachments/assets/cbd85da8-6038-4a8b-8c48-c82ea4488755)
<p><strong>8. Jenkins console Logs</strong></p>

![image](https://github.com/user-attachments/assets/ea66516d-e4f9-4508-976a-1322801bff95)

[Console Output.txt](https://github.com/user-attachments/files/16676184/Console.Output.txt)

<h3><strong>Conclusion</strong></h3>
<p>Using Docker Desktop to run Docker images, like those for Cypress tests, makes it much easier to manage and run your applications. Docker Desktop has a simple interface that lets you set up, run, and monitor containers without needing to use a lot of command-line commands. This is especially helpful in development or testing, where you need to test things quickly. With Docker Desktop, you can speed up your work, save time on setup, and focus more on writing and testing your code instead of dealing with technical details. Whether you're testing complex software or running a simple program, Docker Desktop offers a straightforward and powerful way to get the job done.</p>

