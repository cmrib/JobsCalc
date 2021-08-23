module.exports =  {
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