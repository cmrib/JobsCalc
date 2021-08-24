const Job = require('../model/Job')
const Profile = require('../model/Profile')
const JobUtils = require('../utils/JobUtils')

module.exports = {

    index(req, res) {
        const jobs = Job.get()
        const profile = Profile.get()

        const statusCount = {
            progress: 0,
            done: 0,
            total: jobs.length
        }


        // total de horas por dia de cada Job em progresso
        let jobTotalHours = 0


        const updatedJobs = jobs.map((job) => {
            const remaining = JobUtils.remainingDays(job)
            const status = remaining <= 0 ? 'done' : 'progress'
  
            // statusCount['done'] += 1
            // statusCount['progress'] += 1
            // somando a quantidade de status
            statusCount[status] += 1

            
            // total de horas por dia de cada Job
            jobTotalHours = status == 'progress' ? jobTotalHours + Number(job['daily-hours']) : jobTotalHours
            
            // ajustes no jobs 
            return {
                ...job,
                remaining,
                status,
                budget: JobUtils.calculateBudget(job, profile["value-hour"])
            }
        })

        // qtd de giras que quero trabalhar(PROFILE)
        // - hrs de cada job em progress

        const freeHours = profile['hours-per-day'] - jobTotalHours




        return res.render("index", { jobs: updatedJobs, profile: profile, statusCount: statusCount, freeHours: freeHours })

    }
}
