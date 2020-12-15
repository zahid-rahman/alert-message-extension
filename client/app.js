let isDateExpired = (currentDate,expireDate) => {
	let totalDays = expireDate.diff(currentDate,'days')
	console.log(totalDays)
	if(totalDays <= 15){
		return {
			isExpired:true,
			totalDays
		}
	}
	else{
		return {
			isExpired:false
		}
	}
}

let showExpireAlertMessage = (alertPromptMessage,expireDate,textAlertMessage,className) => {
	alert(alertPromptMessage+moment(expireDate).format('MMM Do YYYY'))
	$(`.${className}`).html(textAlertMessage)
}

let getDataFromServer = () => {
	axios.get(`http://localhost:5660/expireDates`)
	.then(response => {
		console.log(response.data)
		let {
			rootPermitExpireDate,
			fitnessExpireDate,
			taxTokenExpireDate
		} = response.data

		let currentDate = moment().format("YYYY-MM-DD")

		let rootPermitDate = moment(rootPermitExpireDate)
		let isRootPermitExpire = isDateExpired(currentDate,rootPermitDate)

		let taxTokenDate = moment(taxTokenExpireDate)
		let isTaxTokenExpire = isDateExpired(currentDate,taxTokenDate)

		let fitnessDate = moment(fitnessExpireDate)
		let isFitnessExpire = isDateExpired(currentDate,fitnessDate)

		if(isRootPermitExpire.isExpired === true){
			showExpireAlertMessage(
				`your root permit papers about to expired on `,
				rootPermitDate,
				`${isRootPermitExpire.totalDays} days left to expire your root permit papers`,
				`root-permit`
			)
		}
		else{
			$('.result').show()
		}

		if(isTaxTokenExpire.isExpired === true){
			showExpireAlertMessage(
				`your tax token papers about to expired on `,
				taxTokenDate,
				`${isTaxTokenExpire.totalDays} days left to expire your tax token papers`,
				`tax-token`
			)
		}
		else{
			$('.result').show()
		}

		if(isFitnessExpire.isExpired === true){
			showExpireAlertMessage(
				`your vehicle fitness papers about to expired on `,
				fitnessDate,
				`${isFitnessExpire.totalDays} days left to expire your vehicles fitness papers`,
				`fitness`
			)
		}
		else{
			$('.result').show()
		}

	})
	.catch(error => {
		console.log(error)
	})
}

$(document).ready(() => {
	$('button').click(function(event){
		event.preventDefault()
		getDataFromServer()
	})
	console.log(moment(new Date()).format("YYYY-DD-MM"))
})