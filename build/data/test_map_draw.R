library("maptools")
library("tidyverse")
library("broom")
library("rgdal")
library("metromonitor")

data <- read_csv("/home/alec/Projects/Brookings/broadband/build/data/Masterfile.txt")
data$atl3 <- substring(data$atl3,1,1)
data$atl10 <- substring(data$atl10,1,1)
data$atl25 <- substring(data$atl25,1,1)
data$above1g <- substring(data$above1g,1,1)
data$pov <- data$inpov/data$povuniv
data$ba <- data$baplus_1115/data$edattain_univ_1115
data$ki <- data$u18_1115/data$pop_1115
data$access <- ifelse(data$atl25=="N", 0, 1)

DTA <- data[c("cbsa","tract","stplfips","atl25","pcat_10x1","pop_1115","ba","pov","ki")]
names(DTA) <- c("cbsa","tr","pl","av","su","pop","ba","pov","ki")

colors <-c('#a50f15','#a50f15','#ef3b2c','#9ecae1','#6baed6','#084594')

draw <- function(cbsa_code, filter="all"){
  shp <- readOGR("/home/alec/Projects/Brookings/js-modules/maps/build/data/geo/tract/2014/shp", cbsa_code)
  
  if(filter=="pov"){
    DTA <- DTA[DTA$pov > 0.2, ]
  } else if(filter=="avail"){
    DTA <- DTA[DTA$av=="N", ]
  } else if(filter=="ba"){
    DTA <- DTA[DTA$ba > 0.2977, ]
  } else if(filter=="ki"){
    DTA <- DTA[DTA$ki > 0.2328, ]
  } else{
    DTA <- DTA
  }
  
  fort <- tidy(shp, region="geo_id")
  fort2 <- merge(fort, DTA, by.x="id", by.y="tr")
  fort2 <- fort2[order(fort2$order), ]
  
  print(filter);
  
  fort2$subscription <- factor(fort2$su, levels=0:5, labels=c("0","0-20","20-40","40-60","60-80","80-100"))

  gg <- ggplot(fort2) + geom_polygon(aes(x=long, y=lat, group=id, fill=subscription), color="#ffffff", size=0.2) + 
         scale_fill_manual(values=colors, limits=c("0","0-20","20-40","40-60","60-80","80-100")) + theme_bw() + coord_fixed()
  
  plot(gg)
  
  return(DTA[DTA$cbsa==as.integer(cbsa_code) & !is.na(DTA$cbsa), c("tr","av","su","pop","ba","pov","ki")])
}

tst <- draw("10420") #akron
draw("16700") #charleston
draw("42660") #seattle

draw("10420","pov") #akron
draw("16700","pov") #charleston
draw("42660","pov") #seattle

draw("10420","avail") #akron
draw("16700","avail") #charleston
draw("42660","avail") #seattle

draw("10420","ba") #akron
draw("16700","ba") #charleston
draw("42660","ba") #seattle

draw("10420","ki") #akron
draw("16700","ki") #charleston
draw("42660","ki") #seattle

cbsas <- as.integer(metropops()$CBSA_Code)
for(c in cbsas){
  draw(c)
}

