package ecoders.ecodersbackend.domain.mission.repository;

import ecoders.ecodersbackend.domain.mission.entity.Mission;
import ecoders.ecodersbackend.domain.mission.entity.MissionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MissionRepository extends JpaRepository<Mission, Long> {

    List<Mission> findByMissionType(MissionType missionType);

}
