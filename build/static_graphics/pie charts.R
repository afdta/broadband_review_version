library(tidyverse)

setwd("/home/alec/Projects/Brookings/broadband/build/static_graphics")

#pie charts
#3 MBPS
svg("access_3mbps.svg", antialias="none")
pie(x=c(0.007,0.993), labels=c("0.7%", ""), 
    init.angle=90, clockwise=TRUE,
    col=c("#dc2a2a","#c4e0fb"), 
    lty=0, main="3 Mbps")
dev.off()

#10MBPS
svg("access_10mbps.svg", antialias="none")
pie(x=c(0.021,0.979), labels=c("2.1%", ""), 
    init.angle=90, clockwise=TRUE,
    col=c("#dc2a2a","#c4e0fb"), 
    lty=0, main="10 Mbps")
dev.off()

#25MBPS
svg("access_25mbps.svg", antialias="none")
pie(x=c(0.07,0.93), labels=c("7.0%", ""), 
    init.angle=90, clockwise=TRUE,
    col=c("#dc2a2a","#c4e0fb"), 
    lty=0, main="25 Mbps")
dev.off()

#1GBPS
svg("access_1gbps.svg", antialias="none")
pie(x=c(0.937,0.063), labels=c("93.7%", ""), 
    init.angle=90, clockwise=TRUE,
    col=c("#dc2a2a","#c4e0fb"), 
    lty=0, main="1 Gbps")
dev.off()



#URBAN RURAL
#pie charts
#Rural
svg("geo_rural.svg", antialias="none")
pie(x=c(0.274,0.726), labels=c("27.4%", ""), 
    init.angle=90, clockwise=TRUE,
    col=c("#dc2a2a","#c4e0fb"), 
    lty=0, main="Rural")
dev.off()

#Small metro
svg("geo_smallmetro.svg", antialias="none")
pie(x=c(0.081,0.919), labels=c("8.1%", ""), 
    init.angle=90, clockwise=TRUE,
    col=c("#dc2a2a","#c4e0fb"), 
    lty=0, main="Small metro areas")
dev.off()

#Suburbs
svg("geo_suburbs.svg", antialias="none")
pie(x=c(0.029,0.971), labels=c("2.9%", ""), 
    init.angle=90, clockwise=TRUE,
    col=c("#dc2a2a","#c4e0fb"), 
    lty=0, main="Suburbs")
dev.off()

#City
svg("geo_city.svg", antialias="none")
pie(x=c(0.006,0.994), labels=c("0.6%", ""), 
    init.angle=90, clockwise=TRUE,
    col=c("#dc2a2a","#c4e0fb"), 
    lty=0, main="City")
dev.off()


#subscription, low, medium, high
svg("subscription_barplot.svg", antialias="none")
barplot(matrix(c(73.5,185.7,57.1), ncol=1), col=c("#ef3b2c","#cccccc","#084594"), horiz=TRUE, border=NA, legend.text=c("low","med","high"))
dev.off()

round(100*c(73.5,185.7,57.1)/sum(c(73.5,185.7,57.1)), 1)

#read in table 3 from FCC's Fifth International Broadband Data Report, 2016.
#cut and pasted from page 27; accessed 8/29/2017; url: https://apps.fcc.gov/edocs_public/attachmatch/DA-16-97A1.pdf
table3 <- read_delim("/home/alec/Projects/Brookings/broadband/build/data/table3_intnl_broadband_data_report.txt", delim=" ")
table3$Country2 <- factor(table3$Country, levels=table3[order(table3$Dollars_per_Mbps), ]$Country)

ggplot(table3) + geom_col(aes(x=Country2, y=Dollars_per_Mbps) ) + 
  geom_text(aes(x=Country2, y=Dollars_per_Mbps, label=paste0("$",Dollars_per_Mbps)), nudge_y=0.5 ) + 
  coord_flip() + theme_bw() + scale_y_continuous(breaks=c(0,5,10,15))
ggsave("price_by_country_table3.pdf", device="pdf", width=6.5)
