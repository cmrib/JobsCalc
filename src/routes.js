const express = require('express')

// objeto de rotas do Router
const routes = express.Router()




const Profile = {
  data: {
    name: 'Cicero',
    avatar: 'https://github.com/cmrib.png',
    "monthly-budget": 3000,
    "days-per-week": 5,
    "hours-per-day": 5,
    "vacation-per-year": 4,
    "value-hour": 60,
  },

  controllers: {
    index(req, res) {
      return res.render("profile", { profile: Profile.data })
    },

    update(req, res) {
// req.body para pegar os dados
      const data = req.body

      // definir quantas semanas tem num ano: 52
      const weeksPerYear = 52

      // remover as semanas de férias do ano, para pegar quantas semanas tem em 1 mês
      const weeksPerMonth = (weeksPerYear - data["vacation-per-year"] ) / 12
      
      // total de horas trabalhadas na semana
      const weekTotalHours  = data["hours-per-day"] * data["days-per-week"]

      // horas trabalhadas no mês
      const monthlyTotalHours = weekTotalHours * weeksPerMonth

      // qual será o valor da minha hora?
      const valueHour = data["monthly-budget"] / monthlyTotalHours

      Profile.data = {
        ...Profile.data,
        ...req.body,
        "value-hour": valueHour
      }

      return res.redirect('/profile')

    }
  }
}

const Job = {

  data: [
    {
      id: 1,
      name: 'Pizzaria Guloso',
      "daily-hours": 2,
      "total-hours": 1,
      created_at: Date.now(),      
    },
    {
      id: 2,
      name: 'OneTwo Project',
      "daily-hours": 3,
      "total-hours": 47,
      created_at: Date.now(),      
    },

  ],

  controllers: {
    index(req, res) {

      const updatedJobs = Job.data.map((job) => {

        const remaining = Job.services.remainingDays(job)
        const status = remaining <= 0 ? 'done' : 'progress'
        // ajustes no jobs 
        return {
          ...job,
          remaining,
          status,
          budget: Job.services.calculateBudget(job, Profile.data["value-hour"])
        }
      })

      return res.render("index", { jobs: updatedJobs })

    },

    create(req, res) {
      return res.render("job")
    },

    save(req, res) {

      const lastId = Job.data[Job.data.length - 1]?.id || 0;

      // salva os dados do body da requisição no array de jobs
      Job.data.push({
        id: lastId + 1,
        name: req.body.name,
        "daily-hours": req.body["daily-hours"],
        "total-hours": req.body["total-hours"],
        created_at: Date.now()
      })

      // redireciona para o index
      return res.redirect('/')

    },

    show(req,res) { 
     
      // esse .id deve ser o mesmo passado no url da rota     
      // req.params recebe o id do botao enviado pela url na requisiçao
      const jobId = req.params.id
      
      // se o find encontrar o job.id === jobId, 
      // ele retorna para o vetor job criado
      const job = Job.data.find(job => Number(job.id) === Number(jobId))

      if(!job){
        return res.send('Job not found!')
      }

      job.budget = Job.services.calculateBudget(job, Profile.data["value-hour"])

      return res.render("job-edit", { job }) 
    },

    update(req, res){
      
      // esse .id deve ser o mesmo passado no url da rota     
      // req.params recebe o id do botao enviado pela url na requisiçao
      const jobId = req.params.id
      
      // se o find encontrar o job.id === jobId, 
      // ele retorna para o vetor job criado
      const job = Job.data.find(job => Number(job.id) === Number(jobId))

      if(!job){
        return res.send('Job not found!')
      }

      const updatedJob = {        
        ...job,
        name: req.body.name,
        "total-hours": req.body['total-hours'],
        "daily-hours": req.body['daily-hours'],
      }

      // atualizar o Job.data com os dados do updatedJob 

      Job.data = Job.data.map(job => {
        
        if(Number(job.id) === Number(jobId)){
          job = updatedJob
        }
        return job
      })      
      res.redirect('/job/' + jobId)

    },

    delete(req, res){
      const jobId = req.params.id

      // o filter percorre o array e retira o que se deseja
      Job.data = Job.data.filter(job => Number(job.id) !== Number(jobId))

      return res.redirect('/')
    }

  },

  services: {
    remainingDays(job) {

      // calculo do tempo restante

      //calcula a quantidade de dias e arredonda o resultado
      const remainingDays = (job["total-hours"] / job["daily-hours"]).toFixed()

      // cria objeto Data de quando foi registrado o job
      const createdDate = new Date(job.created_at)

      // dueDay detorna o dia de vencimento
      const dueDay = createdDate.getDate() + Number(remainingDays)

      // transforma o dia do vencimento em uma data
      const dueDateInMs = createdDate.setDate(dueDay)

      //
      const timeDiffInMs = dueDateInMs - Date.now()

      // transformar mili em dias
      const dayInMs = 1000 * 60 * 60 * 24

      const dayDiff = Math.floor(timeDiffInMs / dayInMs)

      // restam x dias
      return dayDiff

    },

    calculateBudget: (job, valueHour) =>valueHour * job['total-hours'],

    
  }     

}


// rotas
routes.get('/', Job.controllers.index)

routes.get('/job', Job.controllers.create)

// rota para receber os dados do formulario do /job
routes.post('/job', Job.controllers.save)

// rota para recuperar os dados do job quando usuario clicar em editar
routes.get('/job/:id', Job.controllers.show)

routes.post('/job/:id', Job.controllers.update)

routes.post('/job/delete/:id', Job.controllers.delete)

routes.get('/profile', Profile.controllers.index)

routes.post('/profile', Profile.controllers.update)

module.exports = routes;

