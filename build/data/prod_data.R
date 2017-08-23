#broadband data

library(tidyverse)
library(metromonitor)
library(jsonlite)

data <- read_csv("/home/alec/Projects/Brookings/broadband/build/data/Masterfile.txt")
data$atl3 <- substring(data$atl3,1,1)
data$atl10 <- substring(data$atl10,1,1)
data$atl25 <- substring(data$atl25,1,1)
data$above1g <- substring(data$above1g,1,1)
data$pov <- data$inpov/data$povuniv
data$ba <- data$baplus_1115/data$edattain_univ_1115

data$access <- ifelse(data$atl25=="N", 0, data$pop_1115)

data100 <- limit100(data, "cbsa")
data100 <- data100[c("tract","stplfips","atl25","pcat_10x1","pop_1115","ba","pov","u18_1115")]
names(data100) <- c("tr","pl","av","su","pop","ba","pov","ki")

#write out subset
writeLines(toJSON(data100, factor="string", na="null", digits=5), 
           con="/home/alec/Projects/Brookings/broadband/data/tract_data.json")

#write out Akron
akronchi <- data[data$cbsa %in% c("10420","16980"), c("tract","stplfips","atl25","pcat_10x1","pop_1115","ba","pov","u18_1115")]
writeLines(toJSON(akronchi, factor="string", na="null", digits=5), 
           con="/home/alec/Projects/Brookings/broadband/data/akron_chicago.json")

#summarize metro share of pop with 25MBPS 
sums <- data %>% group_by(cbsa, metro) %>% summarise(pop=sum(pop_1115), access=sum(access)) 
sums$share_access <- sums$access/sums$pop
sums <- limit100(sums, "cbsa")
writeLines(toJSON(sums[,c(1,3:5)], digits=5), "/home/alec/Projects/Brookings/broadband/data/metro_access.json")

#share of pop by adoption tier
share <- function(pop){return(pop/sum(pop))}
sums2 <- data %>% group_by(cbsa, metro, pcat_10x1) %>% summarise(pop=sum(pop_1115)) %>% mutate(share=pop/sum(pop)) %>%
                  select(-pop) %>% spread(pcat_10x1, share, fill=0, sep="_")

sums2 <- limit100(sums2, "cbsa")

writeLines(toJSON(sums2[,c(1,3:8)], digits=5), "/home/alec/Projects/Brookings/broadband/data/metro_adoption.json")



#identical
%>% do({
  data <- .
  data$share2 <- data$pop/sum(data$pop)
  data
})

sum(sums2$share==sums2$share2)


#scrap ...




data$yn3 <- ifelse(data$atl3=="NoProviders", "No", "Yes")
data$yn10 <- ifelse(data$atl10=="NoProviders", "No", "Yes")
data$yn25 <- ifelse(data$atl25=="NoProviders", "No", "Yes")
data$yn1g <- ifelse(data$above1g=="NoProviders", "No", "Yes")

#2014 gazetteer tract file seems to match
gaz <- read_tsv("/home/alec/Projects/Brookings/broadband/build/data/gazetteer/2014_Gaz_tracts_national.txt", col_types="ccnnnnnn")
#gaz$density <- gaz$POP10/gaz$ALAND_SQMI

data2 <- merge(data, gaz, by.x="tract", by.y="GEOID", all.x = TRUE)
data2$density <- ifelse(data2$ALAND_SQMI>0, data2$pop_1115/data2$ALAND_SQMI, NA)
data2[data2$ALAND_SQMI==0 & data2$pop_1115>0, ]

##SUMMARIZE

#no access by speed tier
no_access_by_tier <- data2 %>% group_by(geotype) %>% do((function(d){
 cat("Running data for geotype #")
 cat(unique(d$geotype))
 cat("\n")
 
 total <- sum(d$pop_1115)
 
 summary <- d %>% summarise(no3 = sum(d[d$yn3=="No",]$pop_1115), 
                            no10 = sum(d[d$yn10=="No",]$pop_1115), 
                            no25 = sum(d[d$yn25=="No",]$pop_1115),
                            no1g = sum(d[d$yn1g=="No",]$pop_1115)) %>%
                  gather(level, pop_without, no3, no10, no25, no1g)
 
 summary$level <- factor(summary$level, levels=c("no3", "no10", "no25", "no1g"))
 
 return(summary)
})(.)) %>% group_by(level) %>% mutate(share=pop_without/sum(pop_without))

totpop<-sum(data2$pop_1115)

no_access_by_tier$geo_level <- factor(no_access_by_tier$geotype, levels=1:4, labels=c("City", "Suburb", "Small metro", "Rural"))

ggplot(no_access_by_tier %>% filter(level!="no1g")) + geom_col(aes(x=level, y=pop_without, group=geo_level, fill=geo_level))


##summary functions
mean_ <- function(a){return(mean(a, na.rm=TRUE))}
median_ <- function(a){return(median(a, na.rm=TRUE))}
nonzero <- function(a){return(sum(!is.na(a)))}

##summaries
summary <- data %>% group_by(cbsa, metro, yn25) %>% summarise(total=sum(pop_1115, na.rm=TRUE)) %>% 
  spread(yn25, total, fill=0) %>% mutate(Ysh = Yes/(Yes+No), Nsh = No/(Yes+No))

summary2a <- data2 %>% filter(pop_1115 > 0) %>% 
                       group_by(cbsa, metro) %>% 
                       summarise(mean_density=mean(density), 
                                 median_density=median(density), 
                                 ntracks=n(), 
                                 pop=sum(pop_1115), 
                                 sqmi=sum(ALAND_SQMI))

summary2a$density = summary2a$pop/summary2a$sqmi

summary2b <- data2 %>% filter(pop_1115 > 0) %>% 
                       group_by(cbsa, metro, yn25) %>% 
                       summarise(mean_density=mean(density)) %>%
                       spread(yn25, mean_density) %>% 
                       rename(Ydensity=Yes, Ndensity=No)

summary2c <- data2 %>% group_by(cbsa, metro, yn25) %>% 
                       summarise(sqmi=sum(ALAND_SQMI)) %>%
                       spread(yn25, sqmi) %>% 
                       rename(Ysqmi=Yes, Nsqmi=No)

share_ <- function(v){
  v$share <- v$pop/sum(v$pop, na.rm=TRUE)
  return(v)
}
#no service available, city vs suburbs
summary2d <- data2 %>% group_by(cbsa, metro, yn25, geotype) %>% 
                       summarise(pop=sum(pop_1115)) %>%
                       filter(geotype==2 | geotype==1, yn25=="No") %>%
                       group_by(cbsa, metro, yn25) %>%
                       do(share_(.))

#left off here -- building levels to make pie charts ordered from most suburban to least
levels <- (summary2d %>% filter(geotype==2) %>% arrange(share, metro))$metro

summary2d$name <- factor(summary2d$metro, levels=levels)

#summary3 <- data2 %>% group_by(cbsa, metro, yn25) %>% summarise_at("density", funs(mean_density=mean(., na.rm=TRUE))) %>% spread(yn25, mean_density)

summary3 <- merge(merge(merge(summary, summary2a, by=c("cbsa","metro")), summary2b, by=c("cbsa","metro")), summary2c, by=c("cbsa","metro"))
summary3$Ydensity_unwgt <- summary3$Yes/summary3$Ysqmi
summary3$Ndensity_unwgt <- summary3$No/summary3$Nsqmi

library("metromonitor")

summary100 <- limit100(summary3, geoID="cbsa")
#correlations
with(summary100, cor(Nsh, mean_density))
with(summary100, cor(Nsh, log(density)))
with(summary100[summary100$Nsh>0, ], cor(Nsh, Ndensity))
with(summary100[summary100$Nsh>0, ], cor(Nsh, Ndensity_unwgt))

gg <- ggplot(summary100[summary100$density < 2000, ], aes(y=density, x=Nsh))
gg + geom_point(aes(size=No)) + geom_smooth()

gg <- ggplot(summary100, aes(y=log(density), x=Nsh))
gg + geom_point(aes(size=No)) + geom_smooth()

gg2 <- ggplot(summary100[summary100$Nsh>0, ], aes(Ndensity, x=Nsh))
gg2 + geom_point(aes(size=No)) + geom_smooth()

gg2 <- ggplot(summary100[summary100$Nsh>0, ], aes(y=Ndensity_unwgt, x=Nsh))
gg2 + geom_point(aes(size=No)) + geom_smooth()

gg3 <- ggplot(limit100(data2, geoID="cbsa"))
gg3 + geom_point(aes(x=density, y=pop_1115, colour=yn25), alpha=0.3) + 
      facet_wrap(c("geotype", "yn25")) +
      scale_x_continuous(limits=c(0,200000)) +
      scale_y_continuous(limits=c(0,25000))

#city/suburb
ggcs <- ggplot(summary2d)
ggcs + geom_col(aes(x=1, y=share, fill=geotype)) + coord_polar(theta="y") + facet_wrap(c("name"), ncol=18)

#no missing tracts
data2[is.na(data2$ALAND_SQMI), c(1,9,64)]

##CORRELATES OF BROADBAND ADOPTION 
ggadoption <- ggplot(data2[!is.na(data2$pcat_10x1) & data2$pop_1115>0, ])

ggadoption + geom_density(aes(x=foreign_1115/pop_1115), alpha=0.2) + facet_wrap("pcat_10x1", ncol=6)

ggadoption + geom_density(aes(x=(lesshs_1115+hs_1115)/pop_1115), alpha=0.2) + facet_wrap("pcat_10x1", ncol=6)

#function to go from vector of values to vector of deciles
dec <- function(v, wgt=NULL){
  if(!is.null(wgt)){
    vv <- do.call("c", lapply(1:length(v), function(i){
      return(rep(v[i], wgt[i]))
    }))
  } else{
    vv <- v
  }
  
  pctl <- ecdf(vv)
  
  p <- pctl(v)
  return(ceiling(p*5))
}

#create a distribution matrix where each cell is the share of the population 
#cell defined by indicator decile crossed with adoption quintile

#data frame with no missing adoption data and where pop is greater than 0
data3 <- data2 %>% filter(!is.na(pcat_10x1), pop_1115>0) %>% 
                   mutate(fb_share=foreign_1115/pop_1115, white_share=whiteNH_1115/pop_1115, black_share=blackNH_1115/pop_1115,
                          hispanic_share=hisp_1115/pop_1115, hs_share=(lesshs_1115+hs_1115)/pop_1115, age65plus_share=`_65plus`/pop_1115,
                          pov_share=inpov/povuniv)


distribute <- function(indicator){
  tot <- sum(data3$pop_1115)
  df <- data.frame(decile=dec(data3[ ,indicator]), pop=data3$pop_1115, adoption_lvl=data3$pcat_10x1, indicator=indicator)
  summary <- df %>% group_by(decile, adoption_lvl, indicator) %>% summarise(pop=sum(pop), popshare=sum(pop)/tot)
  return(as.data.frame(summary))
}

distros <- do.call("rbind", lapply(c("fb_share","hs_share","hh_medinc_1115","age65plus_share"), distribute))

ggplot(distros, aes(y=decile, x=adoption_lvl, fill=popshare)) + geom_tile() + facet_wrap("indicator") + 
                                  scale_fill_gradient(low="#ffffff", high="#0033ff")

#ggplot(data3) + geom_hex(bins=10) #hexbin not installed

ggplot(distros) + geom_col(aes(x=decile, y=popshare, fill=as.factor(adoption_lvl))) + facet_wrap("indicator") + scale_fill_discrete()

#city share
cityvsuburb <- data2 %>% filter(!is.na(pcat_10x1), geotype <= 2) %>% 
                          complete(geotype, pcat_10x1, nesting(cbsa, metro)) %>% 
                          group_by(cbsa, metro, geotype, pcat_10x1) %>% 
                          summarise_at("pop_1115", funs(pop=sum(., na.rm=TRUE))) %>% 
                          do((function(chunk){
                            chunk$share <- chunk$pop/sum(chunk$pop)
                            chunk$total_pop <- sum(chunk$pop)
                            return(chunk)
                          })(.)) %>% 
                          filter(pcat_10x1 <= 2) %>% 
                          summarise(share=sum(share), pop=sum(pop))

ordered_cs <- cityvsuburb %>% select(-pop) %>% spread(geotype, share) %>% mutate(diff=`1`-`2`) %>% arrange(desc(`1`), desc(`2`))
ordered_cs$leader <- factor(ifelse(ordered_cs$diff >= 0, "City", "Suburb"))
cityvsuburb$name <- factor(cityvsuburb$metro, levels=ordered_cs$metro)
cityvsuburb$type <- factor(cityvsuburb$geotype, levels=c(1,2), labels=c("City","Suburb"))


csgg <- ggplot(cityvsuburb)
csgg + geom_line(aes(x=share, y=name, group=name), linetype=3) + 
       geom_point(aes(x=share, y=name, colour=type, size=pop), pch=21, fill="#ffffff") + 
       theme_bw()

#tile plotting
# 1) summarize a variable int




