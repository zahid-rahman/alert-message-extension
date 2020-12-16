let isDateExpired = (currentDate, expireDate) => {
	let formattedExpireDate = moment(expireDate)
	let totalDays = formattedExpireDate.diff(currentDate, 'days')
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

let getDataFromServer = (url, httpMethod , headers, data, callbackSucess, callbackError) => {
	let objectParams = {}
	objectParams['url'] = url
	objectParams['type'] = httpMethod
	if(headers != null || headers != undefined){
		objectParams['headers'] = headers
	}
	if(data != null || data != undefined){
		objectParams['data'] = data
	}
	objectParams['success'] = function (response){
		callbackSucess(response)
	}
	objectParams['error'] = function (error){
		callbackError(error)
	}
	$.ajax(objectParams);
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
		null,
		null,
		(response) => {
			let {
				rootPermitExpireDate,
				fitnessExpireDate,
				taxTokenExpireDate
			} = response

			let currentDate = moment().format("YYYY-MM-DD")
			let isRootPermitExpire = isDateExpired(currentDate, rootPermitExpireDate)
			let isTaxTokenExpire = isDateExpired(currentDate, taxTokenExpireDate)
			let isFitnessExpire = isDateExpired(currentDate, fitnessExpireDate)

			if (isRootPermitExpire.isExpired === true) {
				showExpireAlertMessage(
					`your root permit papers about to expired on `,
					rootPermitExpireDate,
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
					taxTokenExpireDate,
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
					fitnessExpireDate,
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
		null,
		null,
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
		}, (error) => console.error(error))
}


$(document).ready(() => {
	$('.generate-report').click(function (event) {
		event.preventDefault()
		showAlertMessageInApp()

	})
	showDataInApp()
})