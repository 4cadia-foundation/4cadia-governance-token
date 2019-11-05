### Version Workflow


The workflow adopted for versioning in this repository is [GitFlow](https://danielkummer.github.io/git-flow-cheatsheet/index.html).

 - master: Branch with oficial history of delivery, all the code in production.
 - develop: Branch with the latest code, where all the new functionalities will be create.
 - relase: When the develop branch has funcionalities enough, we create the release branch to specify the new features.
 - feature/tarefa: Each feature has its own branch, and must be created from the develop branch. The name of each feature branch must follow the task code entered in the project, there should be no branches without a task code.

The integration between different branches must be done through pull request, with approval to merge to the requested branch.