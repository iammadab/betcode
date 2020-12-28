function addMeta(property, value, propertyName){
	const metaTag = document.createElement("meta")
	metaTag.setAttribute(propertyName || "property", property)
	metaTag.content = value
	document.head.appendChild(metaTag)
}

