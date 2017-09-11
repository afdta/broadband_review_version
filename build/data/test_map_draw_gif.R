#test of gifs
library("maptools")
library("tidyverse")
library("broom")
library("rgdal")
library("metromonitor")
library("gganimate")

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
  

  pov<- DTA[DTA$pov > 0.2, ]
  avail <- DTA[DTA$av=="N", ]
  ba <- DTA[DTA$ba > 0.2977, ]
  ki <- DTA[DTA$ki > 0.2328, ]
  all <- DTA
  
  all$cut <- 1
  avail$cut <- 2
  pov$cut <- 3
  ba$cut <- 4
  ki$cut <- 5
  stack <- rbind(all, pov, ba, avail, ki)
  stack$subscription <- factor(stack$su, levels=0:5, labels=c("0","0-20","20-40","40-60","60-80","80-100"))
  stack$cut2 <- factor(stack$cut, levels=1:5, labels=c("All neighborhoods","Neighborhoods with broadband availability","Neighborhoods with 20%+ poverty rates","Neighborhoods with above U.S. average bachelor's degree attainment","Neighborhoods with above average shares of children"))
  
  fort <- tidy(shp, region="geo_id")
  
  fort2 <- merge(fort, stack, by.x="id", by.y="tr")
  fort2 <- fort2[order(fort2$cut, fort2$order), ]

  gg <- ggplot(fort2) + geom_polygon(aes(x=long, y=lat, group=id, fill=subscription, frame=cut2), color="#ffffff", size=0.2) + 
    #geom_text(aes(x = min(long), y=max(lat), label=cut2)) +
    scale_fill_manual(values=colors, limits=c("0","0-20","20-40","40-60","60-80","80-100")) + coord_fixed() + 
                                                                                            ggtitle(" Neighborhood subscription rates in the Akron metropolitan area\n") +
                                                                                            theme(axis.line=element_blank(),
                                                                                                  plot.title = element_text(family = "Arial", color="#111111", size=20, hjust=0),
                                                                                                  axis.text.x=element_blank(),
                                                                                                  axis.text.y=element_blank(),
                                                                                                  axis.ticks=element_blank(),
                                                                                                  axis.title.x=element_blank(),
                                                                                                  axis.title.y=element_blank(),
                                                                                                  legend.position="bottom",
                                                                                                  panel.background=element_blank(),
                                                                                                  panel.border=element_blank(),
                                                                                                  panel.grid.major=element_blank(),
                                                                                                  panel.grid.minor=element_blank(),
                                                                                                  plot.background=element_blank())
  
  
  return(gg)
}

gganimate(draw("10420"), "~/Desktop/akron.gif", ani.width=900, ani.height=900) #akron
draw("16700") #charleston
draw("42660") #seattle