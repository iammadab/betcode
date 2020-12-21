function addMeta(property, value){
	const metaTag = document.createElement("meta")
	metaTag.setAttribute("property", property)
	metaTag.content = value
	document.head.appendChild(metaTag)
}
