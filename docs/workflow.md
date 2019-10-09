# Version Workflow


The workflow adopted for versioning in this repository is as follows: [GitFlow](https://danielkummer.github.io/git-flow-cheatsheet/index.html).

 - Master: Branch with oficial history of delivery, all the code in production todos os códigos produtivos.
 - develop: Branch com código mais atual, onde todas as funcionalidades novas serão ramificadas.
 - Relase: Quando o branch develop estiver com funcionalidades suficientes para a entrega, será criado um branch especificando qual é a release para entrega.
 - Feature/Tarefa: Cada funcionalidade tem o seu próprio branch, e deve ser criado a partir da branch develop, o nome de cada branch para funcionalidade deve seguir código da tarefa informada no projeto, não devem existir branchs sem um código de tarefa. 

A integração entre diferentes branchs são feitos através de pull request, com aprovação para mesclar ao branch solicitado.