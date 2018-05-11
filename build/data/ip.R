

library(tidyverse)
library(readxl)
library(jsonlite)

totmet <- read_excel("/home/alec/Projects/Brookings/water-workforce/build/data/Water Emp - By Metro - For Alec.xlsx", sheet=2) %>%
            filter(TOP_METRO==1) %>%
            select(cbsa=CBSA, title=area_title, empw=SumOfWater_Emp, empt=tot_emp)

water_wages <- read_excel("/home/alec/Projects/Brookings/water-workforce/build/data/Water Emp - By Metro - For Alec.xlsx", sheet=3) %>%
            select(cbsa=CBSA_OES, title=area_title, w10=h_pct10, w25=h_pct25, w50=h_median, w75=h_pct75, w90=h_pct90)

tot_wages <- read_excel("/home/alec/Projects/Brookings/water-workforce/build/data/Water Emp - By Metro - For Alec.xlsx", sheet=4) %>%
  select(cbsa=CBSA, title=area_title, t10=h_pct10, t25=h_pct25, t50=h_median, t75=h_pct75, t90=h_pct90)

#to do: validate the CBSA codes -- looks like water codes in NEng. are NECTAs
wages <- full_join(tot_wages, water_wages, by="title", suffix=c("",".y"))

occs <- read_excel("/home/alec/Projects/Brookings/water-workforce/build/data/Water Emp - By Metro - For Alec.xlsx", sheet=1) %>% 
          filter(TOP_METRO==1) %>% select(occ=`occ code`, cbsa=CBSA, title=`area_title`, emp=Water_Emp) %>%
          group_by(cbsa, title) %>% top_n(25, emp) %>% 

occs_dict <- read_excel("/home/alec/Projects/Brookings/water-workforce/build/data/Water Emp - By Metro - For Alec.xlsx", sheet=1) %>%
          select(occ=`occ code`, title=`occ title`) %>% unique() %>% spread(occ, title)

mjoin <- full_join(totmet, wages) %>% select(-cbsa.y)
msplit <- split(mjoin, mjoin$cbsa)
M <- lapply(msplit, function(e){return(unbox(e))} )

sum(names(M) == sapply(M, function(e){return(e$cbsa)}))

#occupations
O <- list()
O$lookup <- unbox(occs_dict)
O$metros <- split(occs[c("occ", "cbsa", "emp")], occs$cbsa)

#make sure the occupation metro codes match the codes in mjoin above. 
occs_cbsa <- unique(occs[c("cbsa","title")]) %>% full_join(mjoin)

final <- list(summary=M, detail=O)

json <- toJSON(final, digits=5, na="null")

writeLines(c("var data = ", json, ";", "export default data;") ,"/home/alec/Projects/Brookings/water-workforce/build/js/data.js")
