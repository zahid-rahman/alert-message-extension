let isDateExpired = (currentDate, expireDate) => {
	let totalDays = expireDate.diff(currentDate, 'days')
	if (totalDays <= 15) {
		return {
			isExpired: true,
			totalDays
		}
	}
	else {
		return {
			isExpired: false
		}
	}
}

let getDataFromServer = (url, method, callback, error) => {
	$.ajax({
		url: url,
		type: method,
		success: function (response) {
			callback(response)
		},
		error: function (err) {
			error(err)
		}
	});
}

let showExpireAlertMessage = (alertPromptMessage, expireDate, textAlertMessage, className) => {
	alert(alertPromptMessage + moment(expireDate).format('Do MMMM YYYY'))
	$(`.${className}`).html(textAlertMessage)
}


let showExpireDate = (expireDate, dateFormat, className, errorClassName) => {
	let date = moment(expireDate).format(dateFormat)
	$(`.${className}`).html(date)
	$(`.${errorClassName}`).hide()
}


let showAlertMessageInApp = () => {
	getDataFromServer(
		`http://localhost:5660/expireDates`,
		`GET`,
		(response) => {
			let {
				rootPermitExpireDate,
				fitnessExpireDate,
				taxTokenExpireDate
			} = response

			let currentDate = moment().format("YYYY-MM-DD")

			let rootPermitDate = moment(rootPermitExpireDate)
			let isRootPermitExpire = isDateExpired(currentDate, rootPermitDate)

			let taxTokenDate = moment(taxTokenExpireDate)
			let isTaxTokenExpire = isDateExpired(currentDate, taxTokenDate)

			let fitnessDate = moment(fitnessExpireDate)
			let isFitnessExpire = isDateExpired(currentDate, fitnessDate)

			if (isRootPermitExpire.isExpired === true) {
				showExpireAlertMessage(
					`your root permit papers about to expired on `,
					rootPermitDate,
					`${isRootPermitExpire.totalDays} days left to expire your root permit papers`,
					`root-permit`
				)
			}
			else {
				$('.result').show()
			}

			if (isTaxTokenExpire.isExpired === true) {
				showExpireAlertMessage(
					`your tax token papers about to expired on `,
					taxTokenDate,
					`${isTaxTokenExpire.totalDays} days left to expire your tax token papers`,
					`tax-token`
				)
			}
			else {
				$('.result').show()
			}

			if (isFitnessExpire.isExpired === true) {
				showExpireAlertMessage(
					`your vehicle fitness papers about to expired on `,
					fitnessDate,
					`${isFitnessExpire.totalDays} days left to expire your vehicles fitness papers`,
					`fitness`
				)
			}
			else {
				$('.result').show()
			}

		}, error => console.error(error))
}

let showDataInApp = () => {
	getDataFromServer(
		`http://localhost:5660/expireDates`,
		'GET',
		(response) => {
			let {
				rootPermitExpireDate,
				fitnessExpireDate,
				taxTokenExpireDate
			} = response

			showExpireDate(
				rootPermitExpireDate,
				'Do MMMM YYYY',
				'rootPermitDate',
				'no-rootpermit-date'
			)
			showExpireDate(
				fitnessExpireDate,
				'Do MMMM YYYY',
				'fitnessDate',
				'no-fitness-date'
			)
			showExpireDate(
				taxTokenExpireDate,
				'Do MMMM YYYY',
				'taxTokenDate',
				'no-taxtoken-date'
			)
		}, (error) => console.log(error))
}


$(document).ready(() => {
	$('.generate-report').click(function (event) {
		event.preventDefault()
		showAlertMessageInApp()
		
	})
	showDataInApp()
})