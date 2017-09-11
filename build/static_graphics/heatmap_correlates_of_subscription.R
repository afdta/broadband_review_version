#broadband data
#double check the number of missing data for pcat
options(scipen=10000)
library(tidyverse)
library(metromonitor)

data <- read_csv("/home/alec/Projects/Brookings/broadband/build/data/Masterfile.txt")
data$ba <- data$baplus_1115/data$edattain_univ_1115
data$hs <- (data$hs_1115 + data$lesshs_1115)/data$edattain_univ_1115

DTA <- data[, c("cbsa","tract","pcat_10x1","pop_1115","ba","hs","hh_medinc_1115")]

DTA$sub <- factor(ifelse(DTA$pcat_10x1==0, 1, DTA$pcat_10x1), levels=1:5, labels=c("0–20%","20–40%","40–60%","60–80%","80–100%"))
DTA$inc_cat <- cut(DTA$hh_medinc_1115, quantile(DTA$hh_medinc_1115, seq(0,1,0.2), na.rm=TRUE), include.lowest=TRUE, dig.lab=10)
DTA$hs_cat <- cut(DTA$hs, quantile(DTA$hs, seq(0,1,0.2), na.rm=TRUE), include.lowest=TRUE)

group_by(DTA, inc_cat) %>% summarise(n = n())
group_by(DTA, hs_cat) %>% summarise(n = n())

group_share <- function(g){
  g$share <- g$inc_by_sub/sum(g$inc_by_sub)
  return(g)
}

#maxcut <- max((DTA %>% group_by(inc_cat) %>% summarise(people = sum(pop)))$people)
sum_by_inc <- DTA %>% group_by(inc_cat, sub) %>% summarise(inc_by_sub=sum(pop_1115, na.rm=TRUE)) %>% 
                      group_by(inc_cat) %>% mutate(share=inc_by_sub/sum(inc_by_sub, na.rm=TRUE))

sum_by_inc2 <- DTA %>% group_by(inc_cat, sub) %>% summarise(inc_by_sub = sum(pop_1115)) %>% do(group_share(.))
identical(sum_by_inc, sum_by_inc2) #TRUE

ggplot(sum_by_inc) + geom_col(aes(x=inc_cat, y=inc_by_sub, fill=sub), na.rm=TRUE, position="stack")


sum_by_ba <- DTA %>% group_by(ba_cat, sub) %>% summarise(people = sum(pop)) %>% do((function(g){
  g$share <- g$people/sum(g$people)
  return(g)
})(.))

ggplot(sum_by_ba) + geom_col(aes(x=ba_cat, y=people, fill=sub), na.rm=TRUE, position="stack")

ggplot(DTA) + geom_jitter(aes(x=ba, y=sub, alpha=pop))

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
